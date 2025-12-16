// ==========================================
// FILE: data/jobsData.ts
// ==========================================

export interface Job {
  id: string
  title: string
  department: string
  category: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
}

export interface JobCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export const jobCategories: JobCategory[] = [
  {
    id: 'administrative',
    name: 'Administrative',
    description: 'Coordinate operations, manage teams, and ensure smooth organizational functioning',
    icon: 'briefcase',
    color: 'blue'
  },
  {
    id: 'media-production',
    name: 'Media & Production',
    description: 'Create compelling content, capture competition moments, and produce broadcast-quality shows',
    icon: 'video',
    color: 'purple'
  },
  {
    id: 'technical-operations',
    name: 'Technical & Operations',
    description: 'Design obstacles, manage technical equipment, and ensure safe competition environments',
    icon: 'settings',
    color: 'orange'
  },
  {
    id: 'support-logistics',
    name: 'Support & Logistics',
    description: 'Provide essential services including security, medical support, and event operations',
    icon: 'users',
    color: 'red'
  },
  {
    id: 'marketing-sponsorship',
    name: 'Marketing & Sponsorship',
    description: 'Build partnerships, drive engagement, and grow the NNW brand across Nigeria',
    icon: 'trending-up',
    color: 'green'
  }
]

export const jobs: Job[] = [
  // ============================================
  // ADMINISTRATIVE ROLES
  // ============================================
  {
    id: 'state-coordinator',
    title: 'State Coordinators',
    department: 'Administrative',
    category: 'administrative',
    location: 'Multiple States (Nationwide)',
    type: 'Full-time',
    salary: '₦150,000 - ₦250,000/month',
    description: 'Coordinate all NNW activities within your assigned state. Manage registrations, logistics, venue partnerships, and serve as the primary contact for contestants and stakeholders in your region.',
    requirements: [
      'Strong organizational and leadership skills',
      'Excellent communication abilities',
      'Local knowledge and community connections',
      'Event coordination experience',
      'Ability to work independently',
      'Valid driver\'s license'
    ],
    responsibilities: [
      'Coordinate state-level registrations and qualifiers',
      'Build relationships with local gyms and training centers',
      'Manage regional logistics and venues',
      'Recruit and coordinate local volunteers',
      'Report to head office on state activities'
    ]
  },
  {
    id: 'office-assistant',
    title: 'Office Assistants',
    department: 'Administrative',
    category: 'administrative',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦80,000 - ₦120,000/month',
    description: 'Provide administrative support to the NNW team. Handle office operations, scheduling, correspondence, and assist with day-to-day administrative tasks.',
    requirements: [
      'Administrative experience',
      'Proficiency in MS Office',
      'Strong organizational skills',
      'Good communication abilities',
      'Attention to detail',
      'Professional demeanor'
    ],
    responsibilities: [
      'Manage office operations and supplies',
      'Handle correspondence and scheduling',
      'Assist with document preparation',
      'Coordinate meetings and appointments',
      'Support various departments as needed'
    ]
  },
  {
    id: 'legal-advisor',
    title: 'Legal Advisor',
    department: 'Administrative',
    category: 'administrative',
    location: 'Lagos',
    type: 'Full-time',
    salary: '₦300,000 - ₦500,000/month',
    description: 'Provide legal guidance on contracts, liability issues, contestant agreements, sponsorship deals, and ensure compliance with Nigerian entertainment and broadcasting regulations.',
    requirements: [
      'Law degree and valid practicing license',
      '3+ years legal experience',
      'Entertainment/media law knowledge',
      'Contract negotiation expertise',
      'Understanding of Nigerian regulations',
      'Excellent drafting skills'
    ],
    responsibilities: [
      'Review and draft contracts and agreements',
      'Advise on legal and compliance matters',
      'Handle liability and insurance issues',
      'Support sponsorship negotiations',
      'Manage legal documentation'
    ]
  },
  {
    id: 'project-lead',
    title: 'Project Leads',
    department: 'Administrative',
    category: 'administrative',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦250,000 - ₦400,000/month',
    description: 'Lead specific project initiatives within NNW. Coordinate cross-functional teams, manage timelines, budgets, and ensure successful project delivery.',
    requirements: [
      'Project management experience',
      'Strong leadership skills',
      'Budget management abilities',
      'Excellent communication',
      'Problem-solving capabilities',
      'PMP certification (preferred)'
    ],
    responsibilities: [
      'Plan and execute project initiatives',
      'Coordinate cross-functional teams',
      'Manage project budgets and timelines',
      'Track progress and report to management',
      'Ensure quality project delivery'
    ]
  },
  {
    id: 'communication-officer',
    title: 'Communication Officers',
    department: 'Administrative',
    category: 'administrative',
    location: 'Lagos',
    type: 'Full-time',
    salary: '₦150,000 - ₦250,000/month',
    description: 'Manage internal and external communications. Handle media relations, prepare press releases, coordinate stakeholder communications, and maintain NNW\'s public image.',
    requirements: [
      'Communications or PR background',
      'Excellent writing skills',
      'Media relations experience',
      'Crisis communication abilities',
      'Strong interpersonal skills',
      'Journalism experience (preferred)'
    ],
    responsibilities: [
      'Prepare press releases and statements',
      'Manage media relationships',
      'Coordinate internal communications',
      'Handle stakeholder correspondence',
      'Support brand messaging'
    ]
  },
  {
    id: 'registration-supervisor',
    title: 'Registration Supervisors',
    department: 'Administrative',
    category: 'administrative',
    location: 'Multiple Locations',
    type: 'Full-time',
    salary: '₦120,000 - ₦200,000/month',
    description: 'Oversee contestant registration process. Manage registration teams, verify applications, coordinate with IT for database management, and ensure smooth registration operations.',
    requirements: [
      'Data management experience',
      'Strong attention to detail',
      'Team leadership skills',
      'Customer service orientation',
      'Computer proficiency',
      'Problem-solving abilities'
    ],
    responsibilities: [
      'Supervise registration processes',
      'Verify contestant applications',
      'Manage registration databases',
      'Train registration staff',
      'Resolve registration issues'
    ]
  },
  {
    id: 'data-handler',
    title: 'Data Handlers',
    department: 'Administrative',
    category: 'administrative',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦100,000 - ₦150,000/month',
    description: 'Manage contestant data, competition statistics, and maintain accurate databases. Generate reports and ensure data integrity across all systems.',
    requirements: [
      'Data entry experience',
      'Excel proficiency',
      'Attention to detail',
      'Database management knowledge',
      'Analytical skills',
      'Confidentiality'
    ],
    responsibilities: [
      'Input and manage contestant data',
      'Maintain accurate databases',
      'Generate statistical reports',
      'Ensure data security and accuracy',
      'Support data-driven decision making'
    ]
  },

  // ============================================
  // MEDIA & PRODUCTION ROLES
  // ============================================
  {
    id: 'executive-producer',
    title: 'Executive Producer',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Lagos',
    type: 'Full-time',
    salary: '₦500,000 - ₦800,000/month',
    description: 'Lead the entire production of Nigeria\'s first ninja warrior competition series. Oversee creative vision, manage production teams, coordinate with sponsors, and ensure delivery of high-quality broadcast content.',
    requirements: [
      '7+ years in TV/Reality show production',
      'Experience managing large-scale events',
      'Strong leadership and team management',
      'Budget management expertise',
      'Knowledge of Nigerian broadcast standards',
      'Available for extensive travel across Nigeria'
    ],
    responsibilities: [
      'Oversee all aspects of show production from pre to post',
      'Manage production team and coordinate departments',
      'Ensure quality control and brand consistency',
      'Handle sponsor and stakeholder relationships',
      'Develop production timelines and budgets'
    ]
  },
  {
    id: 'production-manager',
    title: 'Production Manager',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦350,000 - ₦500,000/month',
    description: 'Coordinate day-to-day production operations, manage crew schedules, handle logistics for regional competitions and filming across multiple Nigerian cities.',
    requirements: [
      '5+ years production management experience',
      'Event coordination background',
      'Strong organizational skills',
      'Problem-solving abilities',
      'Experience with multi-location shoots',
      'Fluent in English and at least one Nigerian language'
    ],
    responsibilities: [
      'Coordinate shooting schedules and locations',
      'Manage production crew and equipment',
      'Handle logistics and transportation',
      'Ensure safety protocols are followed',
      'Liaise with local authorities and venues'
    ]
  },
  {
    id: 'camera-operator',
    title: 'Camera Operators',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦150,000 - ₦250,000/month',
    description: 'Capture high-energy competition footage, behind-the-scenes content, and contestant stories. Work with state-of-the-art camera equipment to deliver broadcast-quality content.',
    requirements: [
      '3+ years camera operation experience',
      'Experience with sports or action filming',
      'Knowledge of broadcast cameras',
      'Physical fitness for mobile shooting',
      'Own equipment (preferred but not required)',
      'Portfolio of previous work'
    ],
    responsibilities: [
      'Operate cameras during competition filming',
      'Capture dynamic action shots',
      'Work with directors on shot composition',
      'Maintain and troubleshoot camera equipment',
      'Adapt to fast-paced filming environments'
    ]
  },
  {
    id: 'video-editor',
    title: 'Video Editors',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Lagos (Hybrid)',
    type: 'Full-time',
    salary: '₦250,000 - ₦400,000/month',
    description: 'Edit competition episodes, create promotional content, and assemble compelling narratives from raw footage. Transform hours of competition footage into engaging television.',
    requirements: [
      'Professional video editing experience',
      'Proficiency in Adobe Premiere/Final Cut Pro',
      'Understanding of storytelling and pacing',
      'Experience with reality TV or sports content',
      'Strong attention to detail',
      'Ability to work under tight deadlines'
    ],
    responsibilities: [
      'Edit competition episodes and highlights',
      'Create social media content',
      'Collaborate with producers on story arcs',
      'Add graphics, music, and sound effects',
      'Manage post-production workflow'
    ]
  },
  {
    id: 'drone-pilot',
    title: 'Drone Pilots',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦100,000 - ₦180,000/month',
    description: 'Capture aerial footage of competitions and venues. Provide unique perspectives that enhance production value and create stunning visuals.',
    requirements: [
      'Licensed drone pilot certification',
      'Professional drone operation experience',
      'Own drone equipment',
      'Knowledge of aerial cinematography',
      'Understanding of safety protocols',
      'Portfolio of aerial work'
    ],
    responsibilities: [
      'Capture aerial competition footage',
      'Plan and execute drone shots',
      'Maintain and operate drone equipment',
      'Ensure flight safety compliance',
      'Coordinate with production team'
    ]
  },
  {
    id: 'sound-engineer',
    title: 'Sound Engineers',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦120,000 - ₦200,000/month',
    description: 'Capture clean audio during competitions, manage sound mixing, and ensure broadcast-quality sound for all productions.',
    requirements: [
      'Professional sound engineering experience',
      'Knowledge of broadcast audio equipment',
      'Experience with live event sound',
      'Problem-solving and quick thinking',
      'Own equipment (preferred)',
      'Physical ability for location work'
    ],
    responsibilities: [
      'Set up and operate sound equipment',
      'Capture dialogue and ambient sound',
      'Mix audio during live competitions',
      'Troubleshoot audio issues',
      'Collaborate with production team'
    ]
  },
  {
    id: 'graphics-designer',
    title: 'Graphic Designers',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Lagos (Hybrid)',
    type: 'Full-time',
    salary: '₦150,000 - ₦280,000/month',
    description: 'Design graphics for broadcast, social media, and marketing materials. Create visual identity elements that elevate the Naija Ninja Warrior brand.',
    requirements: [
      'Professional graphic design experience',
      'Proficiency in Adobe Creative Suite',
      'Motion graphics skills (After Effects)',
      'Strong portfolio of work',
      'Understanding of brand consistency',
      'Fast turnaround capability'
    ],
    responsibilities: [
      'Design broadcast graphics and overlays',
      'Create social media assets',
      'Develop marketing materials',
      'Design contestant profiles and stats',
      'Maintain brand visual standards'
    ]
  },
  {
    id: 'scriptwriter',
    title: 'Scriptwriters',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Lagos (Hybrid)',
    type: 'Full-time',
    salary: '₦180,000 - ₦300,000/month',
    description: 'Write compelling scripts, contestant narratives, and show commentary. Craft engaging stories that bring the competition to life.',
    requirements: [
      'Professional scriptwriting experience',
      'Understanding of sports/reality TV formats',
      'Strong storytelling abilities',
      'Ability to work under tight deadlines',
      'Creative writing skills',
      'Portfolio of previous work'
    ],
    responsibilities: [
      'Write show scripts and commentary',
      'Develop contestant story arcs',
      'Create promotional content scripts',
      'Collaborate with producers and editors',
      'Maintain consistent show voice'
    ]
  },
  {
    id: 'livestream-handler',
    title: 'Livestream Handlers',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦120,000 - ₦200,000/month',
    description: 'Manage live streaming operations for online audiences. Handle technical setup, monitor stream quality, and engage with online viewers.',
    requirements: [
      'Livestreaming technical experience',
      'Knowledge of streaming platforms',
      'Understanding of encoding and bitrates',
      'Problem-solving abilities',
      'Good communication skills',
      'Ability to work under pressure'
    ],
    responsibilities: [
      'Set up and manage livestream equipment',
      'Monitor stream quality and connectivity',
      'Troubleshoot technical issues',
      'Coordinate with production team',
      'Engage with online audience'
    ]
  },
  {
    id: 'photographer',
    title: 'Photographers',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦100,000 - ₦180,000/month',
    description: 'Capture high-quality still images of competitions, contestants, and events. Provide photography for marketing, social media, and documentation.',
    requirements: [
      'Professional photography experience',
      'Sports or action photography skills',
      'Own camera equipment',
      'Photo editing proficiency',
      'Strong portfolio',
      'Physical fitness for mobile shooting'
    ],
    responsibilities: [
      'Photograph competitions and events',
      'Capture contestant portraits',
      'Edit and deliver photos promptly',
      'Maintain photography equipment',
      'Coordinate with creative team'
    ]
  },
  {
    id: 'social-media-manager',
    title: 'Social Media Managers',
    department: 'Media & Production',
    category: 'media-production',
    location: 'Lagos',
    type: 'Full-time',
    salary: '₦200,000 - ₦350,000/month',
    description: 'Build and engage our online community across Instagram, TikTok, Twitter/X, and YouTube. Create viral content, manage contestant engagement, and drive viewership.',
    requirements: [
      'Proven social media management experience',
      'Content creation skills (video/graphics)',
      'Understanding of Nigerian social media trends',
      'Experience with entertainment or sports brands',
      'Strong copywriting skills',
      'Analytics and growth mindset'
    ],
    responsibilities: [
      'Develop and execute social media strategy',
      'Create engaging content daily',
      'Manage community interactions',
      'Track analytics and optimize performance',
      'Coordinate with production for BTS content'
    ]
  },

  // ============================================
  // TECHNICAL & OPERATIONS ROLES
  // ============================================
  {
    id: 'obstacle-designer',
    title: 'Obstacle Course Designers',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦300,000 - ₦500,000/project',
    description: 'Design, build, and test ninja warrior obstacle courses. Ensure safety while creating challenging and visually exciting obstacles for competitors.',
    requirements: [
      'Engineering or construction background',
      'Understanding of biomechanics and safety',
      'Welding and fabrication skills',
      'Creative problem-solving abilities',
      'Physical fitness and obstacle course knowledge',
      'Team leadership experience'
    ],
    responsibilities: [
      'Design innovative obstacle courses',
      'Oversee construction and installation',
      'Conduct safety testing and inspections',
      'Train crew on obstacle setup',
      'Adapt designs for different venues'
    ]
  },
  {
    id: 'carpenter',
    title: 'Carpenters',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦80,000 - ₦150,000/month',
    description: 'Build and maintain obstacle course structures. Work with designers to bring obstacle concepts to life with quality craftsmanship.',
    requirements: [
      'Professional carpentry experience',
      'Ability to read technical drawings',
      'Own carpentry tools',
      'Physical fitness',
      'Team collaboration skills',
      'Attention to detail'
    ],
    responsibilities: [
      'Construct obstacle course elements',
      'Maintain and repair structures',
      'Follow safety specifications',
      'Work with design team',
      'Ensure quality craftsmanship'
    ]
  },
  {
    id: 'safety-supervisor',
    title: 'Safety Supervisors',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Full-time',
    salary: '₦180,000 - ₦300,000/month',
    description: 'Ensure all safety protocols are followed during competitions. Conduct risk assessments, manage safety equipment, and coordinate with medical teams.',
    requirements: [
      'Safety certification (NEBOSH or equivalent)',
      'Experience in event safety management',
      'First aid and CPR certified',
      'Risk assessment expertise',
      'Strong communication skills',
      'Ability to make quick decisions'
    ],
    responsibilities: [
      'Conduct safety inspections of obstacles',
      'Develop and implement safety protocols',
      'Coordinate with medical teams',
      'Manage safety equipment and supplies',
      'Train staff on safety procedures'
    ]
  },
  {
    id: 'lighting-technician',
    title: 'Lighting Technicians',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦100,000 - ₦180,000/month',
    description: 'Design and operate lighting setups for competitions. Create dramatic lighting effects that enhance the viewing experience and broadcast quality.',
    requirements: [
      'Professional lighting experience',
      'Knowledge of lighting equipment',
      'Understanding of broadcast lighting',
      'Technical troubleshooting skills',
      'Physical ability for rigging work',
      'Portfolio of previous work'
    ],
    responsibilities: [
      'Design lighting setups for competitions',
      'Operate lighting boards during events',
      'Maintain and troubleshoot equipment',
      'Collaborate with camera operators',
      'Ensure optimal lighting for broadcast'
    ]
  },
  {
    id: 'rigger',
    title: 'Riggers',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦90,000 - ₦160,000/month',
    description: 'Install and maintain rigging systems for obstacles and production equipment. Ensure structural safety and stability for all overhead elements.',
    requirements: [
      'Professional rigging certification',
      'Experience with load calculations',
      'Knowledge of safety standards',
      'Physical fitness and comfort with heights',
      'Problem-solving abilities',
      'Team coordination skills'
    ],
    responsibilities: [
      'Install rigging systems for obstacles',
      'Conduct safety inspections',
      'Calculate and verify load limits',
      'Maintain rigging equipment',
      'Train crew on rigging safety'
    ]
  },
  {
    id: 'stage-manager',
    title: 'Stage Managers',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Full-time',
    salary: '₦150,000 - ₦250,000/month',
    description: 'Coordinate all on-stage activities during competitions. Manage crew, ensure smooth transitions, and oversee event flow.',
    requirements: [
      'Stage management experience',
      'Strong organizational skills',
      'Excellent communication',
      'Ability to work under pressure',
      'Problem-solving capabilities',
      'Leadership qualities'
    ],
    responsibilities: [
      'Coordinate stage activities',
      'Manage crew and volunteers',
      'Ensure smooth event flow',
      'Handle on-site logistics',
      'Communicate with production team'
    ]
  },
  {
    id: 'equipment-handler',
    title: 'Equipment Handlers',
    department: 'Technical & Operations',
    category: 'technical-operations',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦60,000 - ₦100,000/month',
    description: 'Manage, transport, and maintain production equipment. Ensure all equipment is properly handled, stored, and ready for use.',
    requirements: [
      'Equipment handling experience',
      'Physical fitness',
      'Valid driver\'s license',
      'Basic technical knowledge',
      'Attention to detail',
      'Team player attitude'
    ],
    responsibilities: [
      'Load and unload equipment',
      'Transport equipment between venues',
      'Perform basic equipment maintenance',
      'Track equipment inventory',
      'Support technical crew'
    ]
  },

  // ============================================
  // SUPPORT & LOGISTICS ROLES
  // ============================================
  {
    id: 'security-staff',
    title: 'Security Staff',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦80,000 - ₦120,000/month',
    description: 'Provide security services for competitions and events. Manage access control, crowd management, and ensure safety of contestants, crew, and audience.',
    requirements: [
      'Security training or certification',
      'Physical fitness',
      'Good communication skills',
      'Alert and observant',
      'Ability to handle pressure',
      'Professional appearance'
    ],
    responsibilities: [
      'Monitor venue security',
      'Control access to restricted areas',
      'Manage crowd movement',
      'Respond to security incidents',
      'Coordinate with local authorities'
    ]
  },
  {
    id: 'medical-personnel',
    title: 'Medical Personnel',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦200,000 - ₦350,000/month',
    description: 'Provide on-site medical support during competitions. Handle injuries, conduct health screenings, and ensure contestant medical safety.',
    requirements: [
      'Valid medical license (Nurse/Paramedic/Doctor)',
      'Emergency response experience',
      'Sports medicine knowledge',
      'Calm under pressure',
      'Physical fitness for event work',
      'Current certifications'
    ],
    responsibilities: [
      'Provide first aid and emergency care',
      'Conduct pre-competition health checks',
      'Monitor contestants during runs',
      'Maintain medical equipment and supplies',
      'Document medical incidents'
    ]
  },
  {
    id: 'transport-crew',
    title: 'Transport Crew',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Multiple States',
    type: 'Contract',
    salary: '₦100,000 - ₦180,000/month',
    description: 'Manage transportation logistics for crew, equipment, and contestants. Coordinate vehicle schedules and ensure timely arrivals at all locations.',
    requirements: [
      'Valid driver\'s license',
      'Clean driving record',
      'Knowledge of local routes',
      'Good communication skills',
      'Reliability and punctuality',
      'Physical ability to assist with loading'
    ],
    responsibilities: [
      'Transport crew and equipment',
      'Maintain vehicle condition',
      'Follow schedules and routes',
      'Assist with equipment loading',
      'Keep transport logs'
    ]
  },
  {
    id: 'volunteer-coordinator',
    title: 'Volunteer Coordinators',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Multiple Locations',
    type: 'Part-time',
    salary: '₦80,000 - ₦150,000/month',
    description: 'Recruit, train, and manage event volunteers. Coordinate volunteer activities and ensure effective support for competitions.',
    requirements: [
      'Experience managing volunteers',
      'Strong organizational skills',
      'Excellent communication',
      'Leadership abilities',
      'Patient and encouraging',
      'Event coordination experience'
    ],
    responsibilities: [
      'Recruit and train volunteers',
      'Assign volunteer roles and schedules',
      'Coordinate volunteer activities',
      'Provide ongoing support',
      'Recognize volunteer contributions'
    ]
  },
  {
    id: 'hospitality-staff',
    title: 'Hospitality Staff',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦70,000 - ₦100,000/month',
    description: 'Provide hospitality services for contestants, guests, and VIPs. Manage catering, refreshments, and ensure positive experiences.',
    requirements: [
      'Hospitality or customer service experience',
      'Professional and friendly demeanor',
      'Good communication skills',
      'Attention to detail',
      'Ability to multitask',
      'Physical stamina'
    ],
    responsibilities: [
      'Manage catering and refreshments',
      'Assist contestants and guests',
      'Maintain hospitality areas',
      'Handle special requests',
      'Ensure cleanliness and organization'
    ]
  },
  {
    id: 'venue-maintenance',
    title: 'Venue Maintenance Personnel',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Multiple Locations',
    type: 'Contract',
    salary: '₦70,000 - ₦100,000/month',
    description: 'Maintain venue cleanliness and functionality. Perform setup, breakdown, and ongoing maintenance during events.',
    requirements: [
      'Maintenance or janitorial experience',
      'Physical fitness',
      'Basic tool knowledge',
      'Attention to detail',
      'Reliable and punctual',
      'Team player'
    ],
    responsibilities: [
      'Maintain venue cleanliness',
      'Assist with setup and breakdown',
      'Perform minor repairs',
      'Manage waste disposal',
      'Support venue operations'
    ]
  },
  {
    id: 'contestant-coordinator',
    title: 'Contestant Coordinators',
    department: 'Support & Logistics',
    category: 'support-logistics',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦180,000 - ₦300,000/month',
    description: 'Manage all contestant relations from application to competition day. Handle registrations, communications, on-site support, and ensure positive contestant experiences.',
    requirements: [
      'Customer service or event coordination experience',
      'Excellent communication skills',
      'Organized and detail-oriented',
      'Problem-solving under pressure',
      'Empathetic and people-focused',
      'Flexible schedule including weekends'
    ],
    responsibilities: [
      'Process contestant applications',
      'Coordinate contestant communications',
      'Manage competition day check-ins',
      'Handle contestant inquiries and issues',
      'Collect contestant stories and testimonials'
    ]
  },

  // ============================================
  // MARKETING & SPONSORSHIP ROLES
  // ============================================
  {
    id: 'sponsorship-manager',
    title: 'Sponsorship Managers',
    department: 'Marketing & Sponsorship',
    category: 'marketing-sponsorship',
    location: 'Lagos',
    type: 'Full-time',
    salary: '₦400,000 - ₦700,000/month + Commission',
    description: 'Secure corporate sponsorships and brand partnerships. Build relationships with Nigerian brands and deliver value through innovative partnership activations.',
    requirements: [
      'B2B sales and partnership experience',
      'Entertainment or sports industry background',
      'Strong negotiation skills',
      'Established Nigerian corporate network',
      'Track record of closing deals',
      'Excellent presentation skills'
    ],
    responsibilities: [
      'Identify and approach potential sponsors',
      'Develop partnership proposals and decks',
      'Negotiate sponsorship agreements',
      'Manage sponsor relationships',
      'Deliver partnership value and reporting'
    ]
  },
  {
    id: 'sales-executive',
    title: 'Sales Executives',
    department: 'Marketing & Sponsorship',
    category: 'marketing-sponsorship',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦120,000 - ₦250,000/month + Commission',
    description: 'Drive ticket sales, merchandise sales, and generate revenue through various channels. Build partnerships with distributors and retailers.',
    requirements: [
      'Sales experience',
      'Strong negotiation skills',
      'Target-driven mindset',
      'Good communication abilities',
      'Customer relationship management',
      'Self-motivated'
    ],
    responsibilities: [
      'Drive ticket and merchandise sales',
      'Build retail partnerships',
      'Meet sales targets',
      'Manage customer relationships',
      'Report on sales performance'
    ]
  },
  {
    id: 'brand-coordinator',
    title: 'Brand Coordinators',
    department: 'Marketing & Sponsorship',
    category: 'marketing-sponsorship',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦150,000 - ₦250,000/month',
    description: 'Maintain brand consistency across all NNW touchpoints. Coordinate marketing materials, merchandise, and ensure brand guidelines are followed.',
    requirements: [
      'Brand management experience',
      'Strong attention to detail',
      'Understanding of brand strategy',
      'Good communication skills',
      'Creative mindset',
      'Experience with design tools'
    ],
    responsibilities: [
      'Ensure brand consistency across channels',
      'Coordinate marketing materials production',
      'Manage merchandise development',
      'Support brand activations',
      'Monitor brand compliance'
    ]
  },
  {
    id: 'pr-officer',
    title: 'PR Officers',
    department: 'Marketing & Sponsorship',
    category: 'marketing-sponsorship',
    location: 'Lagos',
    type: 'Full-time',
    salary: '₦180,000 - ₦300,000/month',
    description: 'Manage public relations and media outreach. Build relationships with journalists, coordinate press events, and maximize positive media coverage.',
    requirements: [
      'Public relations experience',
      'Media industry connections',
      'Excellent writing skills',
      'Event coordination abilities',
      'Strong communication skills',
      'Crisis management experience'
    ],
    responsibilities: [
      'Build media relationships',
      'Coordinate press events',
      'Prepare media kits and releases',
      'Secure media coverage',
      'Monitor brand reputation'
    ]
  },
  {
    id: 'partnership-liaison',
    title: 'Partnership Liaisons',
    department: 'Marketing & Sponsorship',
    category: 'marketing-sponsorship',
    location: 'Lagos/Abuja',
    type: 'Full-time',
    salary: '₦150,000 - ₦280,000/month',
    description: 'Manage day-to-day relationships with brand partners and sponsors. Ensure sponsor deliverables are met and partnerships run smoothly.',
    requirements: [
      'Account management experience',
      'Strong relationship building skills',
      'Excellent communication',
      'Organized and detail-oriented',
      'Problem-solving abilities',
      'Customer service mindset'
    ],
    responsibilities: [
      'Manage sponsor relationships',
      'Coordinate partnership activations',
      'Ensure deliverable completion',
      'Handle sponsor inquiries',
      'Report on partnership performance'
    ]
  }
]

// Helper functions
export const getJobsByCategory = (categoryId: string): Job[] => {
  return jobs.filter(job => job.category === categoryId)
}

export const getJobById = (jobId: string): Job | undefined => {
  return jobs.find(job => job.id === jobId)
}

export const getTotalJobCount = (): number => {
  return jobs.length
}

export const getCategoryJobCount = (categoryId: string): number => {
  return getJobsByCategory(categoryId).length
}