
const MainHeading = ({ title, subTitle }: {title: string; subTitle: string}) => {
    return (
      <div className="flex flex-col items-center mb-12">
        <span className="text-accent font-bold uppercase tracking-[4px] text-sm mb-3">
          {subTitle}
        </span>
        <h2 className="text-4xl font-bold text-gray-800 relative after:absolute after:w-16 after:h-[3px] after:bg-accent after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
          {title}
        </h2>
      </div>
    );
  };
  
  export default MainHeading