export interface Committee {
  id: string;
  name: string;
  description: string;
  category: 'indian' | 'international';
}

export const committees: Committee[] = [
  // Indian Committees
  {
    id: 'lok-sabha',
    name: 'Lok Sabha',
    description: 'Lower House of Indian Parliament',
    category: 'indian'
  },
  {
    id: 'rajya-sabha',
    name: 'Rajya Sabha',
    description: 'Upper House of Indian Parliament',
    category: 'indian'
  },
  {
    id: 'niti-aayog',
    name: 'NITI Aayog',
    description: 'Policy Think Tank of India',
    category: 'indian'
  },
  {
    id: 'supreme-court',
    name: 'Supreme Court of India',
    description: 'Highest Judicial Authority',
    category: 'indian'
  },
  {
    id: 'cabinet',
    name: 'Union Cabinet',
    description: 'Executive Council of Ministers',
    category: 'indian'
  },
  {
    id: 'assembly',
    name: 'Maharashtra Legislative Assembly',
    description: 'State Legislative Body',
    category: 'indian'
  },
  
  // International Committees
  {
    id: 'unsc',
    name: 'UN Security Council',
    description: 'Peace and Security',
    category: 'international'
  },
  {
    id: 'unga',
    name: 'UN General Assembly',
    description: 'Global Deliberative Body',
    category: 'international'
  },
  {
    id: 'ecosoc',
    name: 'ECOSOC',
    description: 'Economic and Social Council',
    category: 'international'
  },
  {
    id: 'unhrc',
    name: 'UN Human Rights Council',
    description: 'Human Rights Protection',
    category: 'international'
  },
  {
    id: 'who',
    name: 'World Health Organization',
    description: 'Global Health Governance',
    category: 'international'
  },
  {
    id: 'nato',
    name: 'NATO',
    description: 'North Atlantic Treaty Organization',
    category: 'international'
  },
  {
    id: 'eu-parliament',
    name: 'European Parliament',
    description: 'EU Legislative Body',
    category: 'international'
  },
  {
    id: 'g20',
    name: 'G20 Summit',
    description: 'Economic Cooperation',
    category: 'international'
  },
  {
    id: 'icc',
    name: 'International Criminal Court',
    description: 'Justice and Accountability',
    category: 'international'
  },
  {
    id: 'us-senate',
    name: 'US Senate',
    description: 'Upper House of US Congress',
    category: 'international'
  },
  {
    id: 'arab-league',
    name: 'Arab League',
    description: 'Regional Cooperation',
    category: 'international'
  },
  {
    id: 'asean',
    name: 'ASEAN',
    description: 'Southeast Asian Nations',
    category: 'international'
  },
  {
    id: 'african-union',
    name: 'African Union',
    description: 'Continental Unity',
    category: 'international'
  }
];

export const getCommitteeById = (id: string): Committee | undefined => {
  return committees.find(committee => committee.id === id);
};

export const getIndianCommittees = (): Committee[] => {
  return committees.filter(committee => committee.category === 'indian');
};

export const getInternationalCommittees = (): Committee[] => {
  return committees.filter(committee => committee.category === 'international');
};
