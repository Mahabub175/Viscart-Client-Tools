import login from "@/assets/images/signUp2.png";
import Image from "next/image";
import SignUpForm from "@/components/LandingPages/SignUp/SignUpForm";

const SignUp = () => {
  return (
    <section className="bg-primaryLight/40 py-20 lg:flex justify-center gap-20 rounded-xl px-10 items-center mb-20">
      <div>
        <Image
          src={login}
          alt="login image"
          height
          width={500}
          className="rounded-xl mb-10 lg:mb-0"
        />
      </div>
      <div>
        <h2 className="text-4xl font-bold">Get Started Now!</h2>
        <p className="text-base text-textColor font-semibold">
          Register now to enjoy all the features
        </p>
        <SignUpForm />
      </div>
    </section>
  );
};

export default SignUp;
