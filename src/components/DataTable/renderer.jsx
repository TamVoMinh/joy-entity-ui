export const date = ({ cellData }) => {
    return cellData
        ? new Date(cellData).toLocaleString('vi-VN', {
              timeZone: 'Europe/Stockholm',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : '';
};

export const text = ({ cellData }) => cellData;
