const BoldText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2)
          return <strong key={index}>{boldText}</strong>
        }
        return part
      })}
    </>
  )
}

export default BoldText
