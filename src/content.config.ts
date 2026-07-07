import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const i18nCollection = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/i18n' }),
  schema: z.object({
    nav: z.object({
      home: z.string(),
      about: z.string(),
      program: z.string(),
      venue: z.string(),
      tickets: z.string(),
    }),
    sponsors: z.object({
      title: z.string(),
      organizer_title: z.string()
    }),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      date: z.string(),
      cta: z.string(),
    }),
    about: z.object({
      title: z.string(),
      quote: z.string(),
      p1: z.string(),
      p2: z.string(),
    }),
    program_teaser: z.object({
      title: z.string(),
      description: z.string(),
      cta: z.string(),
    }),
    venue: z.object({
      title: z.string(),
      description: z.string(),
      cta_section: z.string()
    }),
    tickets: z.object({
      title: z.string(),
      description: z.string(),
      cta: z.string(),
      soon: z.string().optional(),
    }),
    footer: z.object({
      copyright: z.string(),
      legal: z.string(),
    }),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
    venues_page: z.object({
      title: z.string(),
      subtitle: z.string(),
      cta: z.string(),
      map_title: z.string(),
      map_capacity: z.string(),
      map_type: z.string(),
    }).optional(),
    programacion_page: z.object({
      title: z.string(),
      subtitle: z.string(),
      events: z.object({
        view_program: z.string(),
        buy_tickets: z.string(),
        no_events: z.string(),
        view_venue: z.string(),
      }).optional(),
    }).optional(),
    manifesto: z.object({
      hero_pretitle: z.string().optional(),
      hero_title: z.string(),
      hero_subtitle: z.string().optional(),
      hero_intro: z.string(),
      memory_title: z.string(),
      memory_intro: z.string(),
      why_title: z.string(),
      why_p1: z.string(),
      why_p2: z.string(),
      tribute_title: z.string().optional(),
      tribute_text: z.string().optional(),
      director_title: z.string().optional(),
      director_text: z.string().optional(),
      mission_title: z.string(),
      mission_1_title: z.string(),
      mission_1_text: z.string(),
      mission_2_title: z.string(),
      mission_2_text: z.string(),
      mission_3_title: z.string(),
      mission_3_text: z.string(),
      callout: z.string().optional(),
      video_1_title: z.string().optional(),
      video_2_title: z.string().optional(),
      video_3_title: z.string().optional(),
      video_4_title: z.string().optional(),
      video_5_title: z.string().optional(),
      video_6_title: z.string().optional(),
      video_7_title: z.string().optional(),
      video_8_title: z.string().optional(),
    }).optional(),
    manifesto_page: z.object({
      title: z.string(),
      subtitle: z.string(),
      quote: z.string(),
      section1_title: z.string(),
      section1_text: z.string(),
      section2_title: z.string(),
      section2_text: z.string(),
      section3_title: z.string(),
      section3_text: z.string(),
    }).optional()
  })
});

const eventsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/events' }),
  schema: z.object({
    id: z.string(),
    date: z.string(),
    time: z.string(),
    title: z.string(),
    subtitle: z.string(),
    performer: z.string(),
    summary_label: z.string().optional(),
    summary_text: z.string(),
    cta: z.string(),
    url: z.string(),
    image: z.string(),
    venue_id: z.string().optional()
  })
});

const venuesCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/venues' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    long_description: z.array(z.string()).optional(),
    capacity: z.number().optional(),
    acoustic_type: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(),
    slug: z.string(),
    address: z.string().optional(),
    address_url: z.string().optional()
  })
});

export const collections = {
  'i18n': i18nCollection,
  'events': eventsCollection,
  'venues': venuesCollection,
};
