import { ReactElement } from 'react'
import FAQCard from 'src/components/FAQCard'
import PageHead from 'src/components/PageHead'
import FAQLayout from 'src/layouts/FAQLayout'
import NavigationLayout from 'src/layouts/NavigationLayout'
import { defaultFetcher } from 'src/utils'
import useSWR from 'swr'

const description = ''

export default function FAQPage() {
  // Fetch FAQ
  const { data: programFAQs, error } = useSWR(`/api/faq?category=2`, defaultFetcher)

  return (
    <PageHead title="프로그램 관련 FAQ - Be:MySeason" description={description}>
      {programFAQs ? (
        programFAQs.map((faq: any) => <FAQCard key={faq.id} faq={faq} />)
      ) : error ? (
        <div>error</div>
      ) : (
        <div>loading</div>
      )}
    </PageHead>
  )
}

FAQPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <FAQLayout>{page}</FAQLayout>
    </NavigationLayout>
  )
}
