import { isSuperAdmin } from '@/lib/access';
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  access:{
    create: ({req}) => isSuperAdmin(req.user),
    delete: ({req}) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name : "name",
      required : true,
      type : "text",
      label: "Store Name",
      admin: { // admin means the person looking at the dashboard
        description: "This is the name of the store (eg. General Store )"
      },
    },
    {
        name: "slug",
        type: "text",
        index: true,
        required: true,
        unique: true,
        access: {
          update: ({req}) => isSuperAdmin(req.user),
        },
        admin: {
            description: "This is the subdomain for the store (e.g. [slug].funroad.com) "
        },
    },
    {
        name: "image",
        type: "upload",
        relationTo: "media",
    },
    {
        name: "stripeAccountId",
        type: "text",
        required: true,
        access: {
          update: ({req}) => isSuperAdmin(req.user),
        },
        admin: {
          description: "Stripe AccountId associated with your shop",
        }
    },
    {
        name: "stripeDetailsSubmitted",
        type: "checkbox",
        access: {
          update: ({req}) => isSuperAdmin(req.user),
        },
        admin:{
            readOnly: true,
            description: "You cannot create products until you Stripe details"
        },
    },

  ],
};
