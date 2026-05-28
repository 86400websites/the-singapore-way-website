declare module '@mailchimp/mailchimp_marketing' {
  type Config = {
    apiKey: string
    server: string
  }

  type ListMember = {
    email_address: string
    status_if_new: 'subscribed'
    merge_fields?: Record<string, string>
  }

  type MemberTag = {
    name: string
    status: 'active' | 'inactive'
  }

  type MemberTagsBody = {
    tags: MemberTag[]
  }

  const mailchimp: {
    setConfig(config: Config): void
    lists: {
      setListMember(listId: string, subscriberHash: string, member: ListMember): Promise<unknown>
      updateListMemberTags(
        listId: string,
        subscriberHash: string,
        body: MemberTagsBody,
      ): Promise<unknown>
    }
  }

  export default mailchimp
}
