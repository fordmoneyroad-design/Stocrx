/*
  # Payment System for STOCRX - Turo-style Implementation

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User identifier
      - `email` (text, unique) - User email address
      - `full_name` (text) - User full name
      - `phone` (text) - User phone number
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `vehicles`
      - `id` (uuid, primary key) - Vehicle identifier
      - `make` (text) - Car manufacturer
      - `model` (text) - Car model
      - `year` (integer) - Manufacturing year
      - `price` (decimal) - Total vehicle price
      - `down_payment` (decimal) - Required down payment
      - `monthly_payment` (decimal) - Monthly subscription amount
      - `status` (text) - Vehicle status (available, rented, maintenance, sold)
      - `image_url` (text) - Vehicle image URL
      - `mileage` (integer) - Current mileage
      - `vin` (text, unique) - Vehicle identification number
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `bookings`
      - `id` (uuid, primary key) - Booking identifier
      - `user_id` (uuid, foreign key) - References users
      - `vehicle_id` (uuid, foreign key) - References vehicles
      - `start_date` (date) - Subscription start date
      - `status` (text) - Booking status (pending, active, completed, cancelled)
      - `down_payment_paid` (boolean) - Whether down payment is completed
      - `total_paid` (decimal) - Total amount paid so far
      - `ownership_percentage` (decimal) - Current ownership percentage
      - `created_at` (timestamptz) - Booking creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `payments`
      - `id` (uuid, primary key) - Payment identifier
      - `booking_id` (uuid, foreign key) - References bookings
      - `user_id` (uuid, foreign key) - References users
      - `amount` (decimal) - Payment amount
      - `payment_type` (text) - Type of payment (down_payment, monthly, additional)
      - `payment_method` (text) - Payment method (card, bank_transfer, etc)
      - `status` (text) - Payment status (pending, completed, failed, refunded)
      - `stripe_payment_id` (text) - Stripe payment intent ID
      - `transaction_date` (timestamptz) - Payment transaction timestamp
      - `created_at` (timestamptz) - Record creation timestamp

    - `payment_methods`
      - `id` (uuid, primary key) - Payment method identifier
      - `user_id` (uuid, foreign key) - References users
      - `stripe_payment_method_id` (text) - Stripe payment method ID
      - `card_brand` (text) - Card brand (visa, mastercard, etc)
      - `last_four` (text) - Last 4 digits of card
      - `exp_month` (integer) - Expiration month
      - `exp_year` (integer) - Expiration year
      - `is_default` (boolean) - Whether this is the default payment method
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for viewing available vehicles (public access)
    - Add policies for payment management (user-specific access)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal(10,2) NOT NULL,
  down_payment decimal(10,2) NOT NULL DEFAULT 1500.00,
  monthly_payment decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'available',
  image_url text,
  mileage integer,
  vin text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('available', 'rented', 'maintenance', 'sold'))
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  down_payment_paid boolean DEFAULT false,
  total_paid decimal(10,2) DEFAULT 0.00,
  ownership_percentage decimal(5,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_status CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  payment_type text NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_id text,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_payment_type CHECK (payment_type IN ('down_payment', 'monthly', 'additional')),
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_method_id text NOT NULL,
  card_brand text,
  last_four text,
  exp_month integer,
  exp_year integer,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vehicles policies (public read, admin write)
CREATE POLICY "Anyone can view available vehicles"
  ON vehicles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);