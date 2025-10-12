/*
  # Initial STOCRX Database Schema Setup

  ## Overview
  This migration creates the core database structure for the STOCRX platform, 
  a subscription-to-own car rental service.

  ## New Tables Created

  ### 1. `profiles` Table
  Extends Supabase auth.users with additional user information:
  - `id` (uuid, primary key) - References auth.users
  - `first_name` (text) - User's first name
  - `last_name` (text) - User's last name
  - `phone` (text) - Contact phone number
  - `date_of_birth` (date) - User's date of birth
  - `address` (text) - User's address
  - `drivers_license` (text) - Driver's license number
  - `license_state` (text) - State that issued the license
  - `role` (text) - User role (user, admin)
  - `marketing_emails` (boolean) - Newsletter preference
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `vehicles` Table
  Stores car inventory information:
  - `id` (uuid, primary key)
  - `year` (integer) - Vehicle year
  - `make` (text) - Vehicle manufacturer
  - `model` (text) - Vehicle model
  - `price` (numeric) - Total vehicle price
  - `mileage` (integer) - Current mileage
  - `image_url` (text) - Vehicle image URL
  - `down_payment` (numeric) - Required down payment
  - `monthly_payment` (numeric) - Monthly subscription cost
  - `status` (text) - available, rented, sold
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `subscriptions` Table
  Tracks user vehicle subscriptions:
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `vehicle_id` (uuid) - References vehicles
  - `start_date` (date) - Subscription start date
  - `end_date` (date, nullable) - Subscription end date
  - `status` (text) - active, completed, cancelled
  - `equity_built` (numeric) - Total equity accumulated
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `payments` Table
  Records all payment transactions:
  - `id` (uuid, primary key)
  - `subscription_id` (uuid) - References subscriptions
  - `amount` (numeric) - Payment amount
  - `payment_type` (text) - down_payment, monthly, other
  - `payment_date` (timestamptz) - When payment was made
  - `status` (text) - pending, completed, failed
  - `created_at` (timestamptz)

  ## Security Implementation

  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:

  #### Profiles Table Policies:
  1. Users can view their own profile
  2. Users can update their own profile
  3. Admins can view all profiles

  #### Vehicles Table Policies:
  1. Anyone can view available vehicles
  2. Only admins can create vehicles
  3. Only admins can update vehicles
  4. Only admins can delete vehicles

  #### Subscriptions Table Policies:
  1. Users can view their own subscriptions
  2. Users can create their own subscriptions
  3. Admins can view all subscriptions
  4. Admins can update any subscription

  #### Payments Table Policies:
  1. Users can view their own payments
  2. Admins can view all payments
  3. Admins can create and update payments

  ## Important Notes
  - All tables use UUID primary keys with automatic generation
  - Timestamps are automatically managed with triggers
  - RLS is strictly enforced - no data access without proper authentication
  - Foreign key constraints ensure data integrity
  - Indexes are created for performance optimization
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  date_of_birth date,
  address text,
  drivers_license text,
  license_state text,
  role text DEFAULT 'user' NOT NULL,
  marketing_emails boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- VEHICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  year integer NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  price numeric(10, 2) NOT NULL,
  mileage integer NOT NULL,
  image_url text NOT NULL,
  down_payment numeric(10, 2) DEFAULT 1500 NOT NULL,
  monthly_payment numeric(10, 2) DEFAULT 583 NOT NULL,
  status text DEFAULT 'available' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('available', 'rented', 'sold'))
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available vehicles"
  ON vehicles FOR SELECT
  TO authenticated, anon
  USING (status = 'available' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can create vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date date DEFAULT CURRENT_DATE NOT NULL,
  end_date date,
  status text DEFAULT 'active' NOT NULL,
  equity_built numeric(10, 2) DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_subscription_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update any subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  payment_type text DEFAULT 'monthly' NOT NULL,
  payment_date timestamptz DEFAULT now() NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_payment_type CHECK (payment_type IN ('down_payment', 'monthly', 'other')),
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed'))
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = payments.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_vehicle_id ON subscriptions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicles_updated_at'
  ) THEN
    CREATE TRIGGER update_vehicles_updated_at
      BEFORE UPDATE ON vehicles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_subscriptions_updated_at
      BEFORE UPDATE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;