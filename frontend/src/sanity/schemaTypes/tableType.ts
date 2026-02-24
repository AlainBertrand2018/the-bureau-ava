import { defineField, defineType } from 'sanity'

export const tableType = defineType({
    name: 'table',
    title: 'Table',
    type: 'object',
    fields: [
        defineField({
            name: 'rows',
            title: 'Table Rows',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'row',
                    fields: [
                        {
                            name: 'cells',
                            title: 'Cells',
                            type: 'array',
                            of: [{ type: 'string' }]
                        }
                    ]
                }
            ]
        })
    ],
    preview: {
        select: {
            rows: 'rows'
        },
        prepare({ rows }) {
            return {
                title: 'Table',
                subtitle: `${rows?.length || 0} rows`
            }
        }
    }
})
