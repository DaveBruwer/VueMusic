// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';

export default {
  install(app) {
    const baseComponents = import.meta.glob('../components/base/*.vue', {
      eager: true,
    });

    console.log(`baseComponents: ${baseComponents}`);
    console.log(`ObjectEntries: ${Object.entries(baseComponents)}`);

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = _.upperFirst(
        _.camelCase(
          path
            .split('/')
            .pop()
            .replace(/\.\w+$/, ''),
        ),
      );

      console.log(componentName);

      app.component(`Base${componentName}`, module.default);
    });
  },
};
