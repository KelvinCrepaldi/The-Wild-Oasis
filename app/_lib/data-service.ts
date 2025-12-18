import { eachDayOfInterval } from 'date-fns';
import { supabase } from '@/app/_lib/supabase';
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from './types';

/////////////
// GET

export async function getCabin(
  id: number
): Promise<Tables<'cabins'> | null> {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getCabinPrice(
  id: number
): Promise<
  Pick<Tables<'cabins'>, 'regularPrice' | 'discount'> | null
> {
  const { data, error } = await supabase
    .from('cabins')
    .select('regularPrice, discount')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function (): Promise<
  Array<
    Pick<
      Tables<'cabins'>,
      'id' | 'name' | 'maxCapacity' | 'regularPrice' | 'discount' | 'image'
    >
  >
> {
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, maxCapacity, regularPrice, discount, image')
    .order('name');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data ?? [];
};

// Guests are uniquely identified by their email address
export async function getGuest(
  email: string
): Promise<Tables<'guests'> | null> {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(
  id: number
): Promise<Tables<'bookings'>> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not get loaded');
  }

  return data;
}

export async function getBookings(
  guestId: number
): Promise<
  Array<
    Pick<
      Tables<'bookings'>,
      | 'id'
      | 'created_at'
      | 'startDate'
      | 'endDate'
      | 'numNights'
      | 'numGuests'
      | 'totalPrice'
      | 'guestId'
      | 'cabinId'
    > & {
      cabins: Pick<Tables<'cabins'>, 'name' | 'image'> | null;
    }
  >
> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)'
    )
    .eq('guestId', guestId)
    .order('startDate');

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data ?? [];
}

export async function getBookedDatesByCabinId(
  cabinId: number
): Promise<Date[]> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('cabinId', cabinId)
    .or(`startDate.gte.${todayStr},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = (data ?? [])
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate!),
        end: new Date(booking.endDate!),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings(): Promise<Tables<'settings'>> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be loaded');
  }

  return data;
}

export async function getCountries(): Promise<
  Array<{ name: string; flag: string }>
> {
  try {
    const res = await fetch(
      'https://restcountries.com/v2/all?fields=name,flag'
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error('Could not fetch countries');
  }
}

/////////////
// CREATE

export async function createGuest(
  newGuest: TablesInsert<'guests'>
): Promise<Tables<'guests'>[] | null> {
  const { data, error } = await supabase
    .from('guests')
    .insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error('Guest could not be created');
  }

  return data;
}

export async function createBooking(
  newBooking: TablesInsert<'bookings'>
): Promise<Tables<'bookings'>> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(
  id: number,
  updatedFields: TablesUpdate<'guests'>
): Promise<Tables<'guests'>> {
  const { data, error } = await supabase
    .from('guests')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Guest could not be updated');
  }

  return data;
}

export async function updateBooking(
  id: number,
  updatedFields: TablesUpdate<'bookings'>
): Promise<Tables<'bookings'>> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }

  return data;
}

/////////////
// DELETE

export async function deleteBooking(
  id: number
): Promise<Tables<'bookings'>[] | null> {
  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }

  return data;
}
