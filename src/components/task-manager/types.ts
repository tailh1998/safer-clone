export type IChangeEvent = React.ChangeEvent<HTMLInputElement>
export type IFormEvent =
  | React.FormEvent<HTMLFormElement>
  | React.MouseEvent<HTMLButtonElement>
  | React.KeyboardEvent<HTMLInputElement>

export type TTask = {
  id: string
  title: string
  description: string
  userRequestDescription: string
  submissionDate: string
}

export type TMessage = {
  id: number
  type: string
  text: string
  hasDraft?: boolean
  draft?: TDraftTask
}

export type TDraftTask = {
  title: string
  description: string
  userRequestTitle: string
  userRequestDescription: string
}

export type TTabs = "chat" | "dashboard"
