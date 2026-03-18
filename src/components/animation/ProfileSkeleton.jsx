import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] 
          pl-4 
          pr-4 pt-30 
          sm:pl-auto
          md:px-auto
          lg:pl-70
          sm:pr-6 
          md:pr-8 
          lg:px-auto 
          sm:pt-20 
          md:pt-30
          sm:mt-0
          ">
      <div className="bg-white shadow-md p-6 border border-gray-300 px-4 sm:px-10 md:px-20">

        {/* Header */}
        <div className="flex items-center justify-between pt-20">
          <div className="space-y-3">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-16 w-[600px] max-w-full" />
          </div>

          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex gap-5 mt-20">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Content */}
        <div className="mt-10 space-y-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-4/5" />
        </div>

      </div>
    </div>
  );
};

export default ProfileSkeleton;
