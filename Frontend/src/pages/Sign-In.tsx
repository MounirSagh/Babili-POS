import { SignIn, useClerk, useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Component() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      signOut({ redirectUrl: '/' })
    }else if(isLoaded && user?.publicMetadata?.role === 'admin'){
      navigate('/initial')
    }
  }, [isLoaded, user, navigate, signOut]);

  return (
    <div className="flex ">
      <div className="flex w-full justify-center max-w-[600px] flex-col gap-8 p-8 lg:p-12">  
        <SignIn />
      </div>
      <div className="hidden flex-1 flex-col justify-between bg-blue-900 p-12 lg:flex">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Discover Babili Pêche</h2>
          <p className="max-w-md text-lg text-gray-300">
          Over 22 years of experience dedicated to the sale of fishing equipment, aquaculture supplies, and all marine equipment. Our mission is service. 
          </p>
          <button
            className="group p-0 text-white hover:no-underline"
          >
            Sign In and Discover{" "}
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
        <div className="relative h-[500px]">
          {/* <Image
            src="/placeholder.svg?height=500&width=600"
            alt="FishMaster Pro 2.0 Illustration"
            className="object-contain"
            fill
          /> */}
          
        </div>
      </div>
    </div>
  )
}