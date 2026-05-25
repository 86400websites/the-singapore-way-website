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

  const mailchimp: {
    setConfig(config: Config): void
    lists: {
      setListMember(listId: string, subscriberHash: string, member: ListMember): Promise<unknown>
    }
  }

  export default mailchimp
}
