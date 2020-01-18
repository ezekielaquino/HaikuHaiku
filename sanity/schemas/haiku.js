export default {
  name: 'composition',
  title: 'Composition',
  type: 'document',
  liveEdit: true,
  fields: [
    {
      name: 'editable',
      title: 'Editable',
      type: 'boolean',
    },
    {
      name: 'editor',
      title: 'Editor ID',
      type: 'string',
    },
    {
      name: 'passages',
      title: 'Passages',
      type: 'array',
      of: [
        {
          type: 'passage',
        },
      ],
      validation: Rule => Rule.max(3),
    },
  ],
  initialValue: {
    editable: true,
  },
  preview: {
    select: {
      passages: 'passages',
    },
    prepare({ passages }) {
      const passageDefault = {
        content: '',
        user: '',
      };
      const [
        first = passageDefault,
        second = passageDefault,
        third = passageDefault,
      ] = passages;

      return {
        title: `${first.content}, ${second.content}, ${third.content}`,
        subtitle: `by: ${first.user}, ${second.user}, ${third.user},`
      };
    },
  },
}