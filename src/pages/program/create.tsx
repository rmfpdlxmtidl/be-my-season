import type { Editor } from '@toast-ui/react-editor'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ReactElement, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import PageHead from 'src/components/PageHead'
import useRequireAdmin from 'src/hooks/useRequireAdmin'
import NavigationLayout from 'src/layouts/NavigationLayout'
import ProgramLayout from 'src/layouts/ProgramLayout'
import { resizeTextareaHeight, submitWhenShiftEnter } from 'src/utils'
import styled from 'styled-components'

import { TextArea } from '../contact/faq'
import { OrangeButton } from '../introduce'

const ToastEditor = dynamic(() => import('src/components/ToastEditor'), { ssr: false })

const GridGapForm = styled.form`
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
`

const FlexBetweenCenter = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const FlexGap = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
`

const Input = styled.input`
  border: 1px solid #c4c4c4;
  padding: 0.5rem 1rem;
  width: 100%;
`

export const NumberInput = styled(Input)`
  max-width: 10rem;
`

const description = ''

export default function ProgramCreationPage() {
  const router = useRouter()
  useRequireAdmin()

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      imageUrl: '',
      type: 0,
    },
  })

  // Create program
  const editorRef = useRef<Editor>(null)
  const [isCreationLoading, setIsCreationLoading] = useState(false)

  async function createProgram({ title, price, description, imageUrl, type }: any) {
    if (editorRef.current) {
      setIsCreationLoading(true)

      const response = await fetch('/api/program', {
        method: 'POST',
        headers: {
          authorization: sessionStorage.getItem('jwt') ?? localStorage.getItem('jwt') ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price,
          description,
          detail: editorRef.current.getInstance().getHTML(),
          imageUrl,
          type,
        }),
      })

      if (response.ok) {
        toast.success('??????????????? ??????????????????')
        router.replace('/program')
      } else {
        toast.warn(await response.text())
      }

      setIsCreationLoading(false)
    }
  }

  return (
    <PageHead title="???????????? ?????? - Be:MySeason" description={description}>
      <GridGapForm onSubmit={handleSubmit(createProgram)}>
        <FlexBetweenCenter>
          <FlexGap>
            <select disabled={isCreationLoading} {...register('type')}>
              <option value={0}>Pre-W</option>
              <option value={1}>Re-W</option>
              <option value={1}>Re-turnship</option>
            </select>
            <NumberInput
              placeholder="???????????? ????????? ??????????????????"
              type="number"
              {...register('price', { required: '???????????? ????????? ??????????????????' })}
            />
          </FlexGap>
          <OrangeButton disabled={isCreationLoading} type="submit">
            ????????????
          </OrangeButton>
        </FlexBetweenCenter>

        <Input
          placeholder="???????????? ????????? ??????????????????"
          {...register('title', { required: '???????????? ????????? ??????????????????' })}
        />

        <Input placeholder="???????????? ????????? ????????? ??????????????????" {...register('imageUrl')} />
        <TextArea
          onKeyDown={submitWhenShiftEnter}
          onInput={resizeTextareaHeight}
          placeholder="???????????? ????????? ??????????????????"
          {...register('description', { required: '???????????? ????????? ??????????????????' })}
        />
      </GridGapForm>
      <ToastEditor editorRef={editorRef} />
    </PageHead>
  )
}

ProgramCreationPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <ProgramLayout>{page}</ProgramLayout>
    </NavigationLayout>
  )
}
