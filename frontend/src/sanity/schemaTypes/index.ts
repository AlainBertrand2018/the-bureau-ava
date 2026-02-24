import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './postType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { tableType } from './tableType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [postType, authorType, categoryType, tableType],
}
