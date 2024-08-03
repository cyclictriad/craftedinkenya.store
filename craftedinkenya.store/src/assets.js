const images = import.meta.glob('./assets/*', { eager: true });

export const getImageUrl = (url) => {
    return images[`./assets/${url}`].default;
  };