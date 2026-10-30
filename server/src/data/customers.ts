import { Customer } from '../types.js';

export interface CityStatePin {
  city: string;
  state: string;
  postal_codes: string[];
  localities: string[];
}

export const INDIAN_LOCATIONS: CityStatePin[] = [
  {
    city: 'Pune',
    state: 'Maharashtra',
    postal_codes: ['411001', '411004', '411014', '411028', '411038', '411045', '411057'],
    localities: ['FC Road, Shivajinagar', 'Koregaon Park Lane 5', 'Baner-Pashan Link Road', 'Magarpatta City, Hadapsar', 'Kothrud Near MIT', 'Viman Nagar Dutta Mandir', 'Hinjewadi Phase 1']
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_codes: ['400001', '400050', '400053', '400076', '400080', '400092'],
    localities: ['Nariman Point Marine Drive', 'Linking Road, Bandra West', 'Lokhandwala Complex, Andheri', 'Powai Hiranandani Gardens', 'Mulund West Station Road', 'Borivali West Shimpoli']
  },
  {
    city: 'Nashik',
    state: 'Maharashtra',
    postal_codes: ['422001', '422005', '422009', '422013'],
    localities: ['College Road, Thatte Nagar', 'Gangapur Road, Anandwalli', 'Indira Nagar Near Ring Road', 'Panchavati Temple Road']
  },
  {
    city: 'Nagpur',
    state: 'Maharashtra',
    postal_codes: ['440001', '440010', '440012', '440025'],
    localities: ['Civil Lines, Wardha Road', 'Ramdaspeth West Canal Road', 'Dharampeth Extension', 'Manish Nagar Near Flyover']
  },
  {
    city: 'Ahmednagar',
    state: 'Maharashtra',
    postal_codes: ['414001', '414003', '414005'],
    localities: ['Savedi, Pipeline Road', 'Delhi Gate, Station Road', 'Nagar-Pune Highway Bypass', 'Gulmohar Road, Premdan']
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_codes: ['560001', '560034', '560038', '560066', '560100', '560102'],
    localities: ['Indiranagar 100 Feet Road', 'Koramangala 4th Block', 'Whitefield ITPL Main Road', 'HSR Layout Sector 3', 'Electronic City Phase 1', 'Jayanagar 4th T Block']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    postal_codes: ['500001', '500032', '500081', '500034', '500084'],
    localities: ['Jubilee Hills Road No. 36', 'Madhapur Cyber Towers Lane', 'Gachibowli Financial District', 'Banjara Hills Road No. 12', 'Kondapur Near Botanical Garden']
  },
  {
    city: 'Delhi',
    state: 'Delhi',
    postal_codes: ['110001', '110016', '110024', '110048', '110085'],
    localities: ['Connaught Place Inner Circle', 'Hauz Khas Enclave', 'Lajpat Nagar 2', 'Greater Kailash 1', 'Rohini Sector 14']
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    postal_codes: ['600001', '600017', '600028', '600040', '600096'],
    localities: ['T. Nagar Panagal Park', 'Adyar Kasturba Nagar', 'Anna Nagar 2nd Avenue', 'OMR Thoraipakkam IT Corridor', 'Mylapore North Mada Street']
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    postal_codes: ['700001', '700016', '700029', '700091'],
    localities: ['Park Street Camac Street Crossing', 'Salt Lake Sector 5', 'Ballygunge Circular Road', 'New Town Action Area 1']
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    postal_codes: ['380001', '380009', '380015', '380054'],
    localities: ['C.G. Road Navrangpura', 'Satellite Near ISRO', 'Bodakdev Sindhu Bhavan Road', 'Prahlad Nagar Corporate Road']
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    postal_codes: ['302001', '302017', '302020', '302004'],
    localities: ['C-Scheme Subhash Marg', 'Malviya Nagar Near World Trade Park', 'Vaishali Nagar Amrapali Circle', 'Mansarovar Metro Station Area']
  }
];

export const INDIAN_NAMES = [
  { first: 'Rahul', last: 'Sharma' },
  { first: 'Priya', last: 'Patel' },
  { first: 'Amit', last: 'Verma' },
  { first: 'Ananya', last: 'Iyer' },
  { first: 'Vikram', last: 'Malhotra' },
  { first: 'Sneha', last: 'Kulkarni' },
  { first: 'Rohan', last: 'Deshmukh' },
  { first: 'Pooja', last: 'Reddy' },
  { first: 'Aditya', last: 'Joshi' },
  { first: 'Kavita', last: 'Nair' },
  { first: 'Rajesh', last: 'Gupta' },
  { first: 'Neha', last: 'Kadam' },
  { first: 'Suresh', last: 'Menon' },
  { first: 'Deepa', last: 'Bansal' },
  { first: 'Manish', last: 'Chawla' },
  { first: 'Shweta', last: 'Singh' },
  { first: 'Kunal', last: 'Patil' },
  { first: 'Ritu', last: 'Agrawal' },
  { first: 'Varun', last: 'Nambiar' },
  { first: 'Tanvi', last: 'Jadhav' },
  { first: 'Abhishek', last: 'Bhardwaj' },
  { first: 'Meera', last: 'Krishnan' },
  { first: 'Gaurav', last: 'Saxena' },
  { first: 'Divya', last: 'Srinivasan' },
  { first: 'Karthik', last: 'Venkatesh' },
  { first: 'Simran', last: 'Kaur' },
  { first: 'Arjun', last: 'Mehta' },
  { first: 'Pallavi', last: 'Shinde' },
  { first: 'Nikhil', last: 'Bose' },
  { first: 'Sunita', last: 'Choudhary' }
];

export const EMAIL_DOMAINS = ['gmail.com', 'yahoo.in', 'outlook.com', 'rediffmail.com', 'icloud.com'];

export const INITIAL_CUSTOMERS: Customer[] = INDIAN_NAMES.slice(0, 15).map((name, index) => {
  const locIndex = index % INDIAN_LOCATIONS.length;
  const loc = INDIAN_LOCATIONS[locIndex];
  const locality = loc.localities[index % loc.localities.length];
  const postal = loc.postal_codes[index % loc.postal_codes.length];
  const emailDomain = EMAIL_DOMAINS[index % EMAIL_DOMAINS.length];
  const cleanFirst = name.first.toLowerCase();
  const cleanLast = name.last.toLowerCase();

  return {
    customer_id: `CUS-${10001 + index}`,
    customer_name: `${name.first} ${name.last}`,
    customer_email: `${cleanFirst}.${cleanLast}${index > 5 ? index : ''}@${emailDomain}`,
    shipping_address: `Flat ${101 + index * 10}, ${locality}`,
    city: loc.city,
    state: loc.state,
    country: 'India',
    postal_code: postal
  };
});

