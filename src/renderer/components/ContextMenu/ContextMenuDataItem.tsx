/* eslint-disable react/destructuring-assignment */
// import React from 'react';

import Img from '../Img';

const ContextMenuDataItem = (props: { data: ContextMenuAdditionalData }) => {
  const { title, artworkPath, subTitle, subTitle2, button, artworkClassName } =
    props.data;
  return (
    <div className="context-menu-data-item flex max-w-xs flex-row items-center justify-between border-b-[1px] border-b-font-color-dimmed/50 px-3  py-2 font-light text-font-color-black dark:text-font-color-white">
      <div className="flex">
        <Img
          className={`mr-2 aspect-square w-8 rounded-sm ${artworkClassName}`}
          src={artworkPath}
          alt="Context menu data item artwork path"
        />
        <div className="info-container flex w-full flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap">
          <p className="title-container truncate text-sm font-medium">
            {title}
          </p>
          {(subTitle || subTitle2) && (
            <div className="sub-titles-container flex opacity-80">
              <span className="sub-title truncate text-[0.6rem] font-light leading-none">
                {subTitle}
              </span>
              {subTitle && subTitle2 && <span className="mx-1">&bull;</span>}
              <span className="sub-title truncate text-[0.6rem] font-light leading-none">
                {subTitle2}
              </span>
            </div>
          )}
        </div>
      </div>
      {button}
    </div>
  );
};

export default ContextMenuDataItem;
