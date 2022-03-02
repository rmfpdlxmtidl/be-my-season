import Image from 'next/image'
import { ReactElement } from 'react'
import PageHead from 'src/components/PageHead'
import NavigationLayout from 'src/layouts/NavigationLayout'
import ProgramLayout from 'src/layouts/ProgramLayout'
import styled from 'styled-components'

const description = ''

export default function ProgramsPage() {
  return (
    <PageHead title="모든 프로그램 - Be:MySeason" description={description}>
      프로그램
    </PageHead>
  )
}

ProgramsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <ProgramLayout>{page}</ProgramLayout>
    </NavigationLayout>
  )
}