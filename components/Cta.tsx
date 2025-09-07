import Image from "next/image";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">Start learning your way.</div>
      <h2>Build and Personalize Learning Snow Brains</h2>
      <p>
        Pick a name, subject, voice, & personality ~ and start learning through
        voice conversations with our last Model SnowBrain v4
      </p>
      <Image src="images/cta.svg" alt="cta" width={362} height={232} />
      <button className="btn-primary">
        <Image src={"/icons/plus.svg"} alt="plus" width={12} height={12} />
        <Link href={"/brains/new"}>
          <p>Build a New Brain</p>
        </Link>
      </button>
    </section>
  );
};

export default Cta;
