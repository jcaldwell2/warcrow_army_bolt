
import React from 'react';

interface ListMetadata {
  title?: string;
  faction?: string;
  commandPoints?: string;
  totalPoints?: string;
}

interface ListMetadataDisplayProps {
  listMetadata: ListMetadata;
}

const ListMetadataDisplay: React.FC<ListMetadataDisplayProps> = ({ listMetadata }) => {
  if (!listMetadata.title && !listMetadata.commandPoints && !listMetadata.totalPoints) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {listMetadata.title && (
        <div className="bg-background/50 p-3 rounded-md border text-center">
          <h4 className="font-semibold">{listMetadata.title}</h4>
        </div>
      )}
      
      {(listMetadata.commandPoints || listMetadata.totalPoints) && (
        <div className="flex justify-between text-sm">
          {listMetadata.commandPoints && (
            <div className="font-medium">
              {listMetadata.commandPoints}
            </div>
          )}
          
          {listMetadata.totalPoints && (
            <div className="font-medium">
              {listMetadata.totalPoints}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListMetadataDisplay;
