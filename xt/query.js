/* Contributions borrowed from SproutCore:
   https://github.com/sproutcore/sproutcore */
   
/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true */

(function () {
  "use strict";

  XT.query = {
    
    // ..........................................................
    // QUERY LANGUAGE DEFINITION
    //

    /**
      This is the definition of the query language. You can extend it
      by using `SC.Query.registerQueryExtension()`.
    */
    queryLanguage: {

      'UNKNOWN': {
        firstCharacter:   /[^\s'"\w\d\(\)\{\}]/,
        notAllowed:       /[\-\s'"\w\d\(\)\{\}]/
      },

      'PROPERTY': {
        firstCharacter:   /[a-zA-Z_]/,
        notAllowed:       /[^a-zA-Z_0-9\.]/
      },

      'NUMBER': {
        firstCharacter:   /[\d\-]/,
        notAllowed:       /[^\d\-\.]/,
        format:           /^-?\d+$|^-?\d+\.\d+$/
      },

      'STRING': {
        firstCharacter:   /['"]/,
        delimited:        true
      },

      'PARAMETER': {
        firstCharacter:   /\{/,
        lastCharacter:    '}',
        delimited:        true
      },

      '%@': {
        rememberCount:    true,
        reservedWord:     true
      },

      'OPEN_PAREN': {
        firstCharacter:   /\(/,
        singleCharacter:  true
      },

      'CLOSE_PAREN': {
        firstCharacter:   /\)/,
        singleCharacter:  true
      },

      'AND': {
        reservedWord:     true
      },

      'OR': {
        reservedWord:     true
      },

      'NOT': {
        reservedWord:     true
      },

      '=': {
        reservedWord:     true
      },

      '!=': {
        reservedWord:     true
      },

      '<': {
        reservedWord:     true
      },

      '<=': {
        reservedWord:     true
      },

      '>': {
        reservedWord:     true
      },

      '>=': {
        reservedWord:     true
      },

      'BEGINS_WITH': {
        reservedWord:     true
      },

      'ENDS_WITH': {
        reservedWord:     true
      },

      'CONTAINS': {
        reservedWord:     true
      },

      'ANY': {
        reservedWord:     true
      },

      'MATCHES': {
        reservedWord:     true
      },

      'TYPE_IS': {
        reservedWord:     true
      },

      'null': {
        reservedWord:     true
      },

      'undefined': {
        reservedWord:     true
      },

      'false': {
        reservedWord:     true
      },

      'true': {
        reservedWord:     true
      },

      'YES': {
        reservedWord:     true
      },

      'NO': {
        reservedWord:     true
      }

    },


    // ..........................................................
    // TOKENIZER
    //


    /**
      Takes a string and tokenizes it based on the grammar definition
      provided. Called by `parse()`.

      @param {String} inputString the string to tokenize
      @param {Object} grammar the grammar definition (normally queryLanguage)
      @returns {Array} list of tokens
    */
    tokenizeString: function (inputString, grammar) {
      var tokenList           = [],
          c                   = null,
          t                   = null,
          token               = null,
          currentToken        = null,
          currentTokenType    = null,
          currentTokenValue   = null,
          currentDelimiter    = null,
          endOfString         = false,
          endOfToken          = false,
          skipThisCharacter   = false,
          rememberCount       = {};

      // helper function that adds tokens to the tokenList

      var addToken = function (tokenType, tokenValue) {
        var anotherToken;
        t = grammar[tokenType];

        // handling of special cases
        // check format
        if (t.format && !t.format.test(tokenValue)) { tokenType = "UNKNOWN"; }
        // delimited token (e.g. by ")
        if (t.delimited) { skipThisCharacter = true; }

        // reserved words
        if (!t.delimited) {
          for (anotherToken in grammar ) {
            if (grammar[anotherToken].reservedWord &&
                 anotherToken == tokenValue) {
              tokenType = anotherToken;
            }
          }
        }

        // reset t
        t = grammar[tokenType];
        // remembering count type
        if (t && t.rememberCount) {
          if (!rememberCount[tokenType]) { rememberCount[tokenType] = 0; }
          tokenValue = rememberCount[tokenType];
          rememberCount[tokenType] += 1;
        }

        // push token to list
        tokenList.push({tokenType: tokenType, tokenValue: tokenValue});

        // and clean up currentToken
        currentToken      = null;
        currentTokenType  = null;
        currentTokenValue = null;
      };
      
      grammar = grammar || this.queryLanguage;

      // stepping through the string:

      if (!inputString) { return []; }

      var iStLength = inputString.length;

      for (var i = 0; i < iStLength; i++) {

        // end reached?
        endOfString = (i === iStLength - 1);

        // current character
        c = inputString.charAt(i);

        // set true after end of delimited token so that
        // final delimiter is not caught again
        skipThisCharacter = false;


        // if currently inside a token

        if (currentToken) {

          // some helpers
          t = grammar[currentToken];
          endOfToken = t.delimited ? c === currentDelimiter : t.notAllowed.test(c);

          // if still in token
          if (!endOfToken) { currentTokenValue += c; }

          // if end of token reached
          if (endOfToken || endOfString) {
            addToken(currentToken, currentTokenValue);
          }

          // if end of string don't check again
          if (endOfString && !endOfToken) { skipThisCharacter = true; }
        }

        // if not inside a token, look for next one

        if (!currentToken && !skipThisCharacter) {
          // look for matching tokenType
          for (token in grammar) {
            t = grammar[token];
            if (t.firstCharacter && t.firstCharacter.test(c)) {
              currentToken = token;
            }
          }

          // if tokenType found
          if (currentToken) {
            t = grammar[currentToken];
            currentTokenValue = c;
            // handling of special cases
            if (t.delimited) {
              currentTokenValue = "";
              if (t.lastCharacter) { currentDelimiter = t.lastCharacter; }
              else { currentDelimiter = c; }
            }

            if (t.singleCharacter || endOfString) {
              addToken(currentToken, currentTokenValue);
            }
          }
        }
      }

      return tokenList;
    }
  
  };
     
}());
