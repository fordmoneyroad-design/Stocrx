import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentType: 'down_payment' | 'monthly' | 'additional';
  paymentMethodId?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { bookingId, amount, paymentType, paymentMethodId }: PaymentRequest = await req.json();

    if (!bookingId || !amount || !paymentType) {
      throw new Error("Missing required fields");
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, vehicle:vehicles(*)")  
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    const paymentRecord = {
      booking_id: bookingId,
      user_id: user.id,
      amount: amount,
      payment_type: paymentType,
      payment_method: paymentMethodId || "card",
      status: "completed",
      stripe_payment_id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transaction_date: new Date().toISOString(),
    };

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert(paymentRecord)
      .select()
      .single();

    if (paymentError) {
      throw new Error("Payment creation failed");
    }

    const newTotalPaid = parseFloat(booking.total_paid || "0") + amount;
    const vehiclePrice = parseFloat(booking.vehicle.price);
    const newOwnershipPercentage = (newTotalPaid / vehiclePrice) * 100;

    const updates: any = {
      total_paid: newTotalPaid,
      ownership_percentage: newOwnershipPercentage.toFixed(2),
      updated_at: new Date().toISOString(),
    };

    if (paymentType === "down_payment") {
      updates.down_payment_paid = true;
      updates.status = "active";
    }

    if (newOwnershipPercentage >= 100) {
      updates.status = "completed";
      updates.ownership_percentage = 100;
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", bookingId);

    if (updateError) {
      throw new Error("Booking update failed");
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: payment,
        booking: {
          total_paid: newTotalPaid,
          ownership_percentage: newOwnershipPercentage.toFixed(2),
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});