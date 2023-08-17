import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Section } from '@react-email/section'
import { Container } from '@react-email/container'

export const Email = (props: any) => {
  const { code } = props
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>안녕하세요, {"'"}23 전남대학교 PIMM 알고리즘 파티에 관심가져주셔서 감사합니다.</Text>
          <Text style={paragraph}>등록을 위한 인증코드입니다:</Text>
          <Text style={paragraph}>{code}</Text>
        </Container>
      </Section>
    </Html>
  )
}

// Styles for the email template
const main = {
  backgroundColor: '#ffffff',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
}

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
}
