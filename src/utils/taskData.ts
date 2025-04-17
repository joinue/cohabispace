export type Frequency = 
  | 'daily' 
  | 'every-other-day' 
  | 'weekly' 
  | 'every-other-week' 
  | 'monthly' 
  | 'quarterly' 
  | 'annually' 
  | 'weekends'
  | 'weekdays'
  | 'as-needed';

export interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: number; // 1-5 scale, where 1 is easiest and 5 is hardest
  frequency: Frequency;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export const fairPlayCategories: Category[] = [
  {
    id: 'habitat',
    name: 'Habitat',
    description: 'Tasks related to maintaining the home environment',
    tasks: [
      {
        id: 'storage-garage-seasonal',
        name: 'Storage, Garage & Seasonal Items',
        description: 'Managing storage spaces, garage organization, and seasonal items.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'money-manager',
        name: 'Money Manager',
        description: 'Managing family finances, budgeting, and financial planning.',
        category: 'habitat',
        subcategory: 'finances',
        difficulty: 4,
        frequency: 'monthly'
      },
      {
        id: 'memories-photos',
        name: 'Memories & Photos',
        description: 'Organizing and maintaining family photos and memories.',
        category: 'habitat',
        subcategory: 'memories',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'meals-weekend',
        name: 'Meals (Weekend)',
        description: 'Planning and preparing weekend meals for the family.',
        category: 'habitat',
        subcategory: 'meals',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'meals-weekday-dinner',
        name: 'Meals (Weekday Dinner)',
        description: 'Planning and preparing weekday dinner meals.',
        category: 'habitat',
        subcategory: 'meals',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'meals-kids-lunch',
        name: 'Meals (Kids; School Lunch)',
        description: 'Preparing school lunches for children.',
        category: 'habitat',
        subcategory: 'meals',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'meals-weekday-breakfast',
        name: 'Meals (Weekday Breakfast)',
        description: 'Preparing weekday breakfast for the family.',
        category: 'habitat',
        subcategory: 'meals',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'lawn-plants',
        name: 'Lawn & Plants',
        description: 'Maintaining lawn, garden, and indoor plants.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 2,
        frequency: 'weekly'
      },
      {
        id: 'laundry',
        name: 'Laundry',
        description: 'Managing family laundry including washing, drying, folding, and putting away.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'hosting',
        name: 'Hosting',
        description: 'Planning and hosting social gatherings at home.',
        category: 'habitat',
        subcategory: 'social',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'home-purchase',
        name: 'Home Purchase/Rental, Mortgage & Insurance',
        description: 'Managing home ownership, rental agreements, mortgage, and insurance.',
        category: 'habitat',
        subcategory: 'finances',
        difficulty: 5,
        frequency: 'monthly'
      },
      {
        id: 'home-maintenance',
        name: 'Home Maintenance',
        description: 'Maintaining home systems, repairs, and general upkeep.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 4,
        frequency: 'monthly'
      },
      {
        id: 'home-goods-supplies',
        name: 'Home Goods & Supplies',
        description: 'Managing household supplies and goods inventory.',
        category: 'habitat',
        subcategory: 'shopping',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'home-furnishings',
        name: 'Home Furnishings',
        description: 'Managing home furniture and furnishings.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'groceries',
        name: 'Groceries',
        description: 'Planning and shopping for family groceries.',
        category: 'habitat',
        subcategory: 'shopping',
        difficulty: 2,
        frequency: 'weekly'
      },
      {
        id: 'garbage',
        name: 'Garbage',
        description: 'Managing household waste and recycling.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 1,
        frequency: 'daily'
      },
      {
        id: 'dry-cleaning',
        name: 'Dry Cleaning',
        description: 'Managing dry cleaning services and pickups.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 2,
        frequency: 'weekly'
      },
      {
        id: 'dishes',
        name: 'Dishes',
        description: 'Managing dishwashing and kitchen cleanup.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 1,
        frequency: 'daily'
      },
      {
        id: 'cleaning',
        name: 'Cleaning',
        description: 'Maintaining home cleanliness and organization.',
        category: 'habitat',
        subcategory: 'maintenance',
        difficulty: 3,
        frequency: 'weekly'
      }
    ]
  },
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'Tasks that take place outside the home',
    tasks: [
      {
        id: 'social-plans-couples',
        name: 'Social Plans (Couples)',
        description: 'Planning and coordinating couple social activities.',
        category: 'orbit',
        subcategory: 'social',
        difficulty: 2,
        frequency: 'weekly'
      },
      {
        id: 'school-forms-kids',
        name: 'School Forms (Kids)',
        description: 'Managing school-related forms and documentation.',
        category: 'orbit',
        subcategory: 'education',
        difficulty: 2,
        frequency: 'weekly'
      },
      {
        id: 'school-breaks-summer',
        name: 'School Breaks (Kids; Summer)',
        description: 'Planning and managing summer break activities.',
        category: 'orbit',
        subcategory: 'education',
        difficulty: 4,
        frequency: 'quarterly'
      },
      {
        id: 'school-breaks-non-summer',
        name: 'School Breaks (Kids; Non-Summer)',
        description: 'Planning and managing non-summer break activities.',
        category: 'orbit',
        subcategory: 'education',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'returns-store-credits',
        name: 'Returns & Store Credits',
        description: 'Managing product returns and store credits.',
        category: 'orbit',
        subcategory: 'shopping',
        difficulty: 2,
        frequency: 'as-needed'
      },
      {
        id: 'points-miles-coupons',
        name: 'Points, Miles, & Coupons',
        description: 'Managing reward points, travel miles, and coupons.',
        category: 'orbit',
        subcategory: 'finances',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'packing-unpacking-travel',
        name: 'Packing & Unpacking (Travel)',
        description: 'Managing travel packing and unpacking.',
        category: 'orbit',
        subcategory: 'travel',
        difficulty: 3,
        frequency: 'as-needed'
      },
      {
        id: 'packing-unpacking-kids-local',
        name: 'Packing & Unpacking (Kids; Local)',
        description: 'Managing kids\' packing for local activities.',
        category: 'orbit',
        subcategory: 'planning',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'first-aid-safety-emergency',
        name: 'First Aid, Safety, & Emergency',
        description: 'Managing first aid supplies and emergency preparedness.',
        category: 'orbit',
        subcategory: 'safety',
        difficulty: 4,
        frequency: 'monthly'
      },
      {
        id: 'extracurricular-sports',
        name: 'Extracurricular (Kids; Sports)',
        description: 'Managing kids\' sports activities and schedules.',
        category: 'orbit',
        subcategory: 'activities',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'extracurricular-non-sports',
        name: 'Extracurricular (Kids; Non-Sports)',
        description: 'Managing kids\' non-sports extracurricular activities.',
        category: 'orbit',
        subcategory: 'activities',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'electronics-it',
        name: 'Electronics & IT',
        description: 'Managing electronic devices and IT needs.',
        category: 'orbit',
        subcategory: 'technology',
        difficulty: 3,
        frequency: 'as-needed'
      },
      {
        id: 'civic-engagement',
        name: 'Civic Engagement & Cultural Enrichment',
        description: 'Participating in civic and cultural activities.',
        category: 'orbit',
        subcategory: 'community',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'charity-community-service',
        name: 'Charity, Community Service & Good Deeds',
        description: 'Participating in charitable and community service activities.',
        category: 'orbit',
        subcategory: 'community',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'cash-bills',
        name: 'Cash & Bills',
        description: 'Managing cash and bill payments.',
        category: 'orbit',
        subcategory: 'finances',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'calendar-keeper',
        name: 'Calendar Keeper',
        description: 'Managing family calendar and schedules.',
        category: 'orbit',
        subcategory: 'planning',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'birthday-celebrations-other-kids',
        name: 'Birthday Celebrations (Other Kids)',
        description: 'Managing attendance and gifts for other kids\' birthdays.',
        category: 'orbit',
        subcategory: 'social',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'auto',
        name: 'Auto',
        description: 'Managing vehicle maintenance and related tasks.',
        category: 'orbit',
        subcategory: 'transportation',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'tidying-organizing-donations',
        name: 'Tidying Up, Organizing & Donations',
        description: 'Managing home organization and donations.',
        category: 'orbit',
        subcategory: 'maintenance',
        difficulty: 2,
        frequency: 'daily'
      }
    ]
  },
  {
    id: 'care',
    name: 'Care',
    description: 'Tasks related to caring for family members and pets',
    tasks: [
      {
        id: 'pets',
        name: 'Pets',
        description: 'Managing pet care and related responsibilities.',
        category: 'care',
        subcategory: 'pets',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'parents-in-laws',
        name: 'Parents & In-Laws',
        description: 'Managing relationships and care for parents and in-laws.',
        category: 'care',
        subcategory: 'eldercare',
        difficulty: 4,
        frequency: 'weekly'
      },
      {
        id: 'morning-routine-kids',
        name: 'Morning Routine (Kids)',
        description: 'Managing kids\' morning routines and preparations.',
        category: 'care',
        subcategory: 'childcare',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'medical-healthy-living-kids',
        name: 'Medical & Healthy Living (Kids)',
        description: 'Managing kids\' medical care and healthy living practices.',
        category: 'care',
        subcategory: 'health',
        difficulty: 4,
        frequency: 'monthly'
      },
      {
        id: 'homework-projects-school-supplies',
        name: 'Homework Projects & School Supplies (Kids)',
        description: 'Managing kids\' homework and school supplies.',
        category: 'care',
        subcategory: 'education',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'health-insurance',
        name: 'Health Insurance',
        description: 'Managing health insurance and related matters.',
        category: 'care',
        subcategory: 'health',
        difficulty: 4,
        frequency: 'monthly'
      },
      {
        id: 'grooming-wardrobe-player2',
        name: 'Grooming & Wardrobe (Player 2)',
        description: 'Managing Player 2\'s grooming and wardrobe.',
        category: 'care',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'friendships-social-media-kids',
        name: 'Friendships & Social Media (Kids)',
        description: 'Managing kids\' friendships and social media presence.',
        category: 'care',
        subcategory: 'social',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'estate-planning-life-insurance',
        name: 'Estate Planning & Life Insurance',
        description: 'Managing estate planning and life insurance.',
        category: 'care',
        subcategory: 'finances',
        difficulty: 5,
        frequency: 'annually'
      },
      {
        id: 'diapering-potty-training',
        name: 'Diapering & Potty Training (Kids)',
        description: 'Managing diapering and potty training for kids.',
        category: 'care',
        subcategory: 'childcare',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'dental-kids',
        name: 'Dental (Kids)',
        description: 'Managing kids\' dental care.',
        category: 'care',
        subcategory: 'health',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'clothes-accessories-kids',
        name: 'Clothes & Accessories (Kids)',
        description: 'Managing kids\' clothing and accessories.',
        category: 'care',
        subcategory: 'shopping',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'birth-control',
        name: 'Birth Control',
        description: 'Managing birth control and family planning.',
        category: 'care',
        subcategory: 'health',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'bedtime-routine-kids',
        name: 'Bedtime Routine (Kids)',
        description: 'Managing kids\' bedtime routines.',
        category: 'care',
        subcategory: 'childcare',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'grooming-wardrobe-player1',
        name: 'Grooming & Wardrobe (Player 1)',
        description: 'Managing Player 1\'s grooming and wardrobe.',
        category: 'care',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'bathing-grooming-kids',
        name: 'Bathing & Grooming (Kids)',
        description: 'Managing kids\' bathing and grooming.',
        category: 'care',
        subcategory: 'childcare',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'weekend-plans-family',
        name: 'Weekend Plans (Family)',
        description: 'Planning and managing family weekend activities.',
        category: 'care',
        subcategory: 'planning',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'tutoring-coaching-kids',
        name: 'Tutoring & Coaching (Kids)',
        description: 'Managing kids\' tutoring and coaching.',
        category: 'care',
        subcategory: 'education',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'travel',
        name: 'Travel',
        description: 'Managing family travel arrangements.',
        category: 'care',
        subcategory: 'travel',
        difficulty: 4,
        frequency: 'as-needed'
      },
      {
        id: 'transportation-kids',
        name: 'Transportation (Kids)',
        description: 'Managing kids\' transportation needs.',
        category: 'care',
        subcategory: 'transportation',
        difficulty: 3,
        frequency: 'daily'
      }
    ]
  },
  {
    id: 'spark',
    name: 'Spark',
    description: 'Tasks that make life special and enjoyable',
    tasks: [
      {
        id: 'marriage-romance',
        name: 'Marriage & Romance',
        description: 'Maintaining and nurturing the romantic relationship.',
        category: 'spark',
        subcategory: 'relationship',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'magical-beings-kids',
        name: 'Magical Beings (Kids)',
        description: 'Managing kids\' beliefs in magical beings and traditions.',
        category: 'spark',
        subcategory: 'traditions',
        difficulty: 2,
        frequency: 'monthly'
      },
      {
        id: 'informal-education-kids',
        name: 'Informal Education (Kids)',
        description: 'Managing kids\' informal learning experiences.',
        category: 'spark',
        subcategory: 'education',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'holidays',
        name: 'Holidays',
        description: 'Planning and managing holiday celebrations.',
        category: 'spark',
        subcategory: 'celebrations',
        difficulty: 4,
        frequency: 'monthly'
      },
      {
        id: 'holiday-cards',
        name: 'Holiday Cards',
        description: 'Managing holiday card creation and distribution.',
        category: 'spark',
        subcategory: 'correspondence',
        difficulty: 3,
        frequency: 'annually'
      },
      {
        id: 'hard-questions-kids',
        name: 'Hard Questions (Kids)',
        description: 'Addressing kids\' difficult questions and conversations.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 4,
        frequency: 'as-needed'
      },
      {
        id: 'gifts-vips',
        name: 'Gifts (VIPs)',
        description: 'Managing gifts for important people in your life.',
        category: 'spark',
        subcategory: 'gifts',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'gifts-family',
        name: 'Gifts (Family)',
        description: 'Managing gifts for family members.',
        category: 'spark',
        subcategory: 'gifts',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'gestures-love-kids',
        name: 'Gestures of Love (Kids)',
        description: 'Showing love and affection to kids.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'fun-playing-kids',
        name: 'Fun! & Playing (Kids)',
        description: 'Engaging in fun activities and play with kids.',
        category: 'spark',
        subcategory: 'activities',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'extended-family',
        name: 'Extended Family',
        description: 'Managing relationships with extended family.',
        category: 'spark',
        subcategory: 'family',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'birthday-celebrations-your-kids',
        name: 'Birthday Celebrations (Your Kids)',
        description: 'Planning and managing birthday celebrations for your kids.',
        category: 'spark',
        subcategory: 'celebrations',
        difficulty: 4,
        frequency: 'annually'
      },
      {
        id: 'adult-friendships-player2',
        name: 'Adult Friendships (Player 2)',
        description: 'Managing Player 2\'s adult friendships.',
        category: 'spark',
        subcategory: 'social',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'adult-friendships-player1',
        name: 'Adult Friendships (Player 1)',
        description: 'Managing Player 1\'s adult friendships.',
        category: 'spark',
        subcategory: 'social',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'teacher-communication-kids',
        name: 'Teacher Communication (Kids)',
        description: 'Managing communication with kids\' teachers.',
        category: 'spark',
        subcategory: 'education',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'special-needs-mental-health-kids',
        name: 'Special Needs & Mental Health (Kids)',
        description: 'Managing special needs and mental health for kids.',
        category: 'spark',
        subcategory: 'health',
        difficulty: 5,
        frequency: 'daily'
      },
      {
        id: 'self-care-player2',
        name: 'Self-Care (Player 2)',
        description: 'Managing Player 2\'s self-care practices.',
        category: 'spark',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'self-care-player1',
        name: 'Self-Care (Player 1)',
        description: 'Managing Player 1\'s self-care practices.',
        category: 'spark',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'school-transitions-kids',
        name: 'School Transitions (Kids)',
        description: 'Managing kids\' transitions between schools.',
        category: 'spark',
        subcategory: 'education',
        difficulty: 4,
        frequency: 'annually'
      },
      {
        id: 'school-service-kids',
        name: 'School Service (Kids)',
        description: 'Participating in school service activities.',
        category: 'spark',
        subcategory: 'education',
        difficulty: 3,
        frequency: 'monthly'
      },
      {
        id: 'middle-night-comfort-kids',
        name: 'Middle-of-the-Night Comfort (Kids)',
        description: 'Providing comfort to kids during the night.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 3,
        frequency: 'as-needed'
      },
      {
        id: 'thank-you-notes',
        name: 'Thank You Notes',
        description: 'Managing thank you notes and acknowledgments.',
        category: 'spark',
        subcategory: 'correspondence',
        difficulty: 2,
        frequency: 'as-needed'
      },
      {
        id: 'partner-coach',
        name: 'Partner Coach',
        description: 'Supporting and coaching your partner.',
        category: 'spark',
        subcategory: 'relationship',
        difficulty: 4,
        frequency: 'daily'
      },
      {
        id: 'values-good-deeds-kids',
        name: 'Values & Good Deeds (Kids)',
        description: 'Teaching values and encouraging good deeds in kids.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 3,
        frequency: 'daily'
      },
      {
        id: 'showing-up-participating-kids',
        name: 'Showing Up & Participating (Kids)',
        description: 'Attending and participating in kids\' activities.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 3,
        frequency: 'weekly'
      },
      {
        id: 'watching-kids',
        name: 'Watching (Kids)',
        description: 'Supervising and watching kids\' activities.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'spirituality',
        name: 'Spirituality',
        description: 'Managing spiritual practices and beliefs.',
        category: 'spark',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'discipline-screen-time-kids',
        name: 'Discipline & Screen Time (Kids)',
        description: 'Managing discipline and screen time for kids.',
        category: 'spark',
        subcategory: 'parenting',
        difficulty: 3,
        frequency: 'daily'
      }
    ]
  },
  {
    id: 'thrive',
    name: 'Thrive',
    description: 'Personal time and space for individual pursuits',
    tasks: [
      {
        id: 'time-creative',
        name: 'Time alone to do something creative',
        description: 'Personal time for creative pursuits.',
        category: 'thrive',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'time-learn',
        name: 'Time to learn something new',
        description: 'Personal time for learning new skills.',
        category: 'thrive',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'time-self-expression',
        name: 'Time for self-expression',
        description: 'Personal time for self-expression activities.',
        category: 'thrive',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'time-thinking',
        name: 'Time for uninterrupted thinking',
        description: 'Personal time for reflection and thinking.',
        category: 'thrive',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      },
      {
        id: 'time-build-make',
        name: 'Time to build or make something',
        description: 'Personal time for building and creating.',
        category: 'thrive',
        subcategory: 'personal',
        difficulty: 2,
        frequency: 'daily'
      }
    ]
  },
  {
    id: 'storms',
    name: 'Storms',
    description: 'Unexpected or crisis-driven tasks that require special attention',
    tasks: [
      {
        id: 'welcoming-child',
        name: 'Welcoming a Child into the Home',
        description: 'Managing the transition of welcoming a new child.',
        category: 'storms',
        subcategory: 'life-events',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'new-job',
        name: 'New Job',
        description: 'Managing the transition to a new job.',
        category: 'storms',
        subcategory: 'life-events',
        difficulty: 4,
        frequency: 'as-needed'
      },
      {
        id: 'moving',
        name: 'Moving',
        description: 'Managing the process of moving to a new home.',
        category: 'storms',
        subcategory: 'life-events',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'job-loss-money-problems',
        name: 'Job Loss & Money Problems',
        description: 'Managing job loss and financial difficulties.',
        category: 'storms',
        subcategory: 'crisis',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'serious-illness',
        name: 'Serious Illness',
        description: 'Managing serious health issues.',
        category: 'storms',
        subcategory: 'crisis',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'home-renovation',
        name: 'Home Renovation',
        description: 'Managing home renovation projects.',
        category: 'storms',
        subcategory: 'life-events',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'glitch-matrix',
        name: 'Glitch in the Matrix / Daily Disruption',
        description: 'Managing unexpected daily disruptions.',
        category: 'storms',
        subcategory: 'crisis',
        difficulty: 3,
        frequency: 'as-needed'
      },
      {
        id: 'first-year-infant',
        name: 'First Year of Infant\'s Life',
        description: 'Managing the first year of an infant\'s life.',
        category: 'storms',
        subcategory: 'life-events',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'death',
        name: 'Death',
        description: 'Managing the loss of a loved one.',
        category: 'storms',
        subcategory: 'crisis',
        difficulty: 5,
        frequency: 'as-needed'
      },
      {
        id: 'aging-ailing-parent',
        name: 'Aging/Ailing Parent',
        description: 'Managing care for aging or ailing parents.',
        category: 'storms',
        subcategory: 'crisis',
        difficulty: 5,
        frequency: 'as-needed'
      }
    ]
  }
]; 