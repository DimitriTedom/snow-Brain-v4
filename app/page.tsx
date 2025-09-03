import BrainCard from '@/components/BrainCard'
import { Button } from '@/components/ui/button'

const Page = () => {
  return (
  <main>
    <h1 className='text-2xl underline'>Popular Brains</h1>

    <section className='home-section'>
      <BrainCard/>
      <BrainCard/>
      <BrainCard/>
    </section>
  </main>
  )
}

export default Page