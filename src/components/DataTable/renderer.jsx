export const date = ({ cellData }) => {
    return cellData
        ? new Date(cellData).toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : '';
};

export const text = ({ cellData }) => cellData;
