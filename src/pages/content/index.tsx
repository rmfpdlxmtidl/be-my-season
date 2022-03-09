import { ReactElement, useState } from 'react'
import ContentCard from 'src/components/ContentCard'
import PageHead from 'src/components/PageHead'
import ContentLayout from 'src/layouts/ContentLayout'
import NavigationLayout from 'src/layouts/NavigationLayout'
import LeftArrow from 'src/svgs/left-arrow.svg'
import RightArrow from 'src/svgs/right-arrow.svg'
import { defaultFetcher } from 'src/utils'
import styled from 'styled-components'
import useSWR from 'swr'

export const Ul = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem 1rem;
`

export const Ol = styled.ol`
  text-align: center;
`

export const Button = styled.button`
  padding: 0.7rem;
`

export const buttonCount = 3
const description = ''

export default function ContentsPage() {
  const [page, setPage] = useState(1)
  const { data: contents, error } = useSWR(`/api/content?page=${page - 1}`, defaultFetcher)

  // Buttons
  const [big, setBig] = useState(0)

  function goToPreviousPage() {
    setBig(big - 1)
    setPage(buttonCount * big + 1)
  }

  function goToNextPage() {
    setBig(big + 1)
    setPage(buttonCount * (big + 1) + 2)
  }

  return (
    <PageHead title="모든 컨텐츠 - Be:MySeason" description={description}>
      <Ul>
        {contents ? (
          contents.length > 0 ? (
            contents.map((content: any) => (
              <ContentCard key={content.id} content={content} showType />
            ))
          ) : (
            <div>컨텐츠가 없습니다</div>
          )
        ) : error ? (
          'error'
        ) : (
          'loading'
        )}
      </Ul>

      <Ol>
        <Button disabled={big === 0} onClick={goToPreviousPage}>
          <LeftArrow />
        </Button>
        {Array.from(Array(buttonCount).keys()).map((key) => (
          <Button key={key} onClick={() => setPage(buttonCount * big + key + 1)}>
            {buttonCount * big + key + 1}
          </Button>
        ))}
        <Button onClick={goToNextPage}>
          <RightArrow />
        </Button>
      </Ol>
    </PageHead>
  )
}

ContentsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <ContentLayout>{page}</ContentLayout>
    </NavigationLayout>
  )
}
