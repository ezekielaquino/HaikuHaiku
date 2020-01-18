export default {
  name: 'passage',
  title: 'Passage',
  type: 'object',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      return {
        title: content,
      };
    },
  },
}
