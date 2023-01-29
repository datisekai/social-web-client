import React from "react";

interface AvatarGroupProps {
  images: string[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ images }) => {
  const width = 56;

  const widthImage = images.length > 2 ? width / 3 : width;

  return (
    <div className="avatar-group -space-x-6">
   

        <div className="avatar placeholder">
          <div className="w-14 bg-neutral-focus text-neutral-content">
            <span>+99</span>
          </div>
        </div>
    </div>
  );
};

export default AvatarGroup;
