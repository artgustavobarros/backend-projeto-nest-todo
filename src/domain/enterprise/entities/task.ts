import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type Category = 'green' | 'yellow' | 'red'
export type Status = 'done' | 'undone'

export interface TaskProps {
  authorId: UniqueEntityId
  title: string
  content: string
  slug: Slug
  category: Category
  status: Status
  createdAt: Date
  updatedAt?: Date | null
}

export class Task extends Entity<TaskProps> {
  get content() {
    return this.props.content
  }

  get title() {
    return this.props.title
  }

  get authorId() {
    return this.props.authorId
  }

  get slug() {
    return this.props.slug
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get category() {
    return this.props.category
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set category(category: Category) {
    this.props.category = category
    this.touch()
  }

  set status(status: Status) {
    this.props.status = status
    this.touch()
  }

  static create(
    props: Optional<TaskProps, 'updatedAt' | 'slug' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const task = new Task(
      {
        ...props,
        slug:
          props.slug ??
          Slug.createFromText(props.title.concat('-').concat(props.content)),
        createdAt: new Date(),
      },
      id,
    )

    return task
  }
}
