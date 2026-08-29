export interface Testimonial {
  id: string;

  user: {
    name: string;
    role: string;
    avatar: string;
  };

  course: {
    title: string;
    slug: string;
  };

  rating: number;

  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'review-001',
    user: {
      name: 'Aarav Mehta',
      role: 'Frontend Developer',
      avatar: 'https://i.pravatar.cc/160?img=68',
    },
    course: {
      title: 'React & Next.js Masterclass',
      slug: 'react-nextjs-masterclass',
    },
    rating: 5,
    quote:
      'The course was practical from the first lesson. I could apply what I learned directly to my project.',
  },
  {
    id: 'review-002',
    user: {
      name: 'Priya Sharma',
      role: 'Product Designer',
      avatar: 'https://i.pravatar.cc/160?img=44',
    },
    course: {
      title: 'Product UI/UX Design',
      slug: 'product-ui-ux-design',
    },
    rating: 5,
    quote:
      'The structured lessons made it much easier to connect design principles with the work I was already doing.',
  },
  {
    id: 'review-003',
    user: {
      name: 'Rohan Kapoor',
      role: 'Software Engineer',
      avatar: 'https://i.pravatar.cc/160?img=59',
    },
    course: {
      title: 'Node.js Production Backend',
      slug: 'nodejs-production-backend',
    },
    rating: 4,
    quote:
      'I liked that the material focused on building real backend systems instead of only explaining individual concepts.',
  },
];
