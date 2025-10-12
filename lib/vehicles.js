import { supabase } from './supabase.js';

export const getAllVehicles = async (status = 'available') => {
  try {
    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return { data: null, error };
  }
};

export const getVehicleById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return { data: null, error };
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return { data: null, error };
  }
};

export const updateVehicle = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return { data: null, error };
  }
};

export const deleteVehicle = async (id) => {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return { error };
  }
};

export const createSubscription = async (userId, vehicleId) => {
  try {
    const { data: vehicle, error: vehicleError } = await getVehicleById(vehicleId);
    if (vehicleError || !vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.status !== 'available') {
      throw new Error('Vehicle is not available');
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        vehicle_id: vehicleId,
        status: 'active',
        equity_built: 0
      }])
      .select()
      .single();

    if (subError) throw subError;

    await supabase
      .from('vehicles')
      .update({ status: 'rented' })
      .eq('id', vehicleId);

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        subscription_id: subscription.id,
        amount: vehicle.down_payment,
        payment_type: 'down_payment',
        status: 'completed'
      }])
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating down payment:', paymentError);
    }

    return { data: subscription, error: null };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return { data: null, error };
  }
};
