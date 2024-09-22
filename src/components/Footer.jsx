import React from "react";

function Footer() {
  return (
    <div className="w-full bg-black ">
      <div className="contianer mx-auto px-4 py-8 lg:py-16 flex justify-around">
        {/* Page content comes here */}
        <p className="text-white">
          © 2024. All rights reserved.
        </p>
        <span>
          <a href="https://github.com/aphsavii" className="text-white underline">Github</a>
        </span>
      </div>
    </div>
  );
}

export default Footer;
