const indexService = require('../services/indexService');

// Index CRUD Operations
exports.createIndex = async indexName => {
  try {
    const response = await indexService.createIndex(indexName);
    //console.log('createIndex response: ', response);
    return `Successfully created Index '${indexName}'`;
  } catch (err) {
    let errorMessage;
    if (err.message == 'invalid_index_name_exception')
      errorMessage = 'Index name was invalid. Please try again.';
    else if (err.message == 'resource_already_exists_exception')
      errorMessage = 'Index already exists';

    return errorMessage;
  }
};

exports.deleteIndex = async indexName => {
  try {
    if (indexName) {
      await indexService.deleteIndex(indexName);
      return `Successfully deleted Index '${indexName}'`;
    } else {
      await crudService.deleteAllIndices();
      return 'Successfully deleted All indices';
    }
  } catch (err) {
    //console.log(err.message);
    let errorMessage = err.message;
    return errorMessage;
  }
};

exports.createMapping = async indexName => {
  // read on 'index: not_analyzed', 'include_in_all: false', 'index: no' etc
  const mapping = {
    properties: {
      title: {
        type: 'completion', // will be used in auto-complete suggestions
        analyzer: 'simple',
        search_analyzer: 'simple'
      },
      phase: {
        type: 'completion',
        analyzer: 'simple',
        search_analyzer: 'simple'
      },
      category_name: { type: 'keyword' }, // type=keyword means exact matches only
      rating_name: { type: 'keyword' },
      budget: { type: 'keyword' }, // we do not want ES to look inside the value, for example for '000'
      release_year: {
        type: 'date',
        format: 'yyyy||epoch_millis'
      },
      release_date: { type: 'date', format: 'MMM dd, yyyy||epoch_millis' }
    }
  };

  try {
    const response = await indexService.createMapping(indexName, mapping);
    //console.log('createMapping response: ', response);
    return `Successfully created Mapping on index '${indexName}'`;
  } catch (err) {
    return err.message.reason;
    // TODO: make the error shorter
  }
};
