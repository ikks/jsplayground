function SoupLetter(incoming_words){

    var self = this;
    self.words = incoming_words.split(','); // Holds the incoming words
    self.found_words = new Array(); // Holds the found words
    self.local_matrix = new Array(); // Holds the board of the soup letter
    self.positions = new Array(); // Holds the positions of the words 
    self.getsin = [
        function(x, k, length, max){ return x - k >= 0 && x + length - k < max; },
        function(x, k, length, max){ return x - length + k >= 0 && x + k < max;},
    ];
    self.letters = new Array();  // Holds the letters of the incoming words

    self.cleanmatrix = function(cant){
        // Initializes a matrix of size cant * cant with dashes
        self.local_matrix = new Array();
        for (var i = 0; i < cant; i++) {
            self.local_matrix[i] = new Array();
            for (var j = 0; j< cant; j++){
                self.local_matrix[i][j] = '-';
            }
        }
    }

    self.try_word = function(x_dir, y_dir, p_x, p_y, k, word, max){
        // Tries to put a word in direction x_dir, y_dir, with the intersection
        // located at p_x, p_y with the letter at position k of the word
        // it returns false if the word is out of bounds or is no room because
        // there are other words that do not allow to put the word properly 
        var w_length = word.length;
        var good = false;
        var x_ini = p_x;
        var y_ini = p_y;
        var target = 0;
        if (x_dir > 0 && self.getsin[0](p_x, k, w_length, max)) {
            x_ini -= k;
            if(y_dir > 0 && self.getsin[0](p_y, k, w_length, max)) {
                // 1 1
                y_ini -= k;
                good = true;
            }
            if (y_dir < 0 && self.getsin[1](p_y, k, w_length, max)) {
                // 1 -1
                y_ini += k;
                good = true;
            }
            if (y_dir === 0) {
                // 1 0
                good = true;
            }
        }
        else if(x_dir < 0 && self.getsin[1](p_x, k, w_length, max)){
            x_ini += k;
            if (y_dir > 0 && self.getsin[0](p_y, k, w_length, max)) {
                // -1 1
                y_ini -= k;
                good = true;
            }
            if (y_dir < 0 && self.getsin[1](p_y, k, w_length, max)) {
                // -1 -1
                y_ini += k;
                good = true;
            }
            if (y_dir === 0){
                // -1 0
                good = true;
            }
        }
        else if (x_dir === 0){
            if (y_dir > 0 && self.getsin[0](p_y, k, w_length, max)) {
                // 0 1
                y_ini -= k;
                good = true;
            }
            if (y_dir < 0 && self.getsin[1](p_y, k, w_length, max)) {
                // 0 -1
                y_ini +=k;
                good = true;
            }
        }
        if (!good){
            return false;
        }
        for(var i = 0; i < w_length; i++) {
            target = self.local_matrix[x_ini + (i * x_dir)][y_ini + (i * y_dir)];
            if(target != '-' && target != word[i]) {
                return false;
            }
        }
        self.put_word(x_dir, y_dir, x_ini, y_ini, word);
        return true;
    };

    self.put_word = function(dir_x, dir_y, p_x, p_y, word){
        // Puts the word in direction dir_x, dir_y starting at the point p_x, p_y
        for(i=0; i < word.length; i++){
            self.local_matrix[p_x + (i * dir_x)][p_y + (i * dir_y)] = word[i];
        }
        self.positions[word] = ({'i': p_x, 'j': p_y, 'x': dir_x, 'y': dir_y, 'found': false})
    }

    self.try_put_word = function(cur_word, inter_word, inter_cur, position){
        // Determines if the cur can be added given 
        // Positions the word if possible
        // cur_word word to be positioned
        // inter_word: character position of intersection of the positioned word
        // inter_cur: character position of intersection of the target word
        // position: information of the current word inside the board
        var p_x = position['i'] + inter_word * position['x'];
        var p_y = position['j'] + inter_word * position['y'];
        var max = self.local_matrix.length;
        var tries = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
        ]
        for (var i = 0; i < 8; i++){
            if(self.try_word(tries[i][0], tries[i][1], p_x, p_y, inter_cur, cur_word, max)){
                return true;
            }
        }
        return false;
    }

    self.fill_empties = function(){
        // Fills the board with letters contained in the words
        for (var i = 0; i < self.local_matrix.length; i++){
            for (var j = 0; j < self.local_matrix.length; j++){
                if (self.local_matrix[i][j] === '-') {
                    self.local_matrix[i][j] = self.letters[Math.floor(Math.random() * self.letters.length)];
                }
            }
        }
    }

    self.put_words = function (){
        // fills the board with the hidden words
        var clone = self.words.slice(0);
        clone.sort
        (
            function(a, b) {
                return b.length - a.length;
            }
        );
        var word = clone[0];
        var half_word = Math.floor(clone[0].length / 2);
        var x = Math.floor(self.local_matrix.length / 2);
        var y = Math.min(Math.floor(Math.random() * self.local_matrix.length), self.local_matrix.length -1);
        var cur_idx = 0;
        var others = new Array();
        var found = false;
        var l = 0;
        self.try_put_word(word, 0, half_word, {'i': x, 'j': y, 'x': 0, 'y': 1});
        for (var w = 0; w < clone.length; w++) {
            for (var h = 0; h < clone[w].length; h++){
                self.letters.push(clone[w][h]);
            }
        }
        for (var j = 1; j < clone.length; j++){
            // j loops over the words we want to include in the board
            positioned = false;
            for (word in self.positions){
                // Loop over the previous reviewed words
                for(var k = 0; k < word.length; k++){
                    // k loops over the letters on the word to be included
                    l = clone[j].indexOf(word[k], 0);
                    // l is used to determine if both words intersect
                    while(l != -1){
                        // We try to position the word in the intersection
                        if (!self.try_put_word(clone[j], k, l, self.positions[word])){
                            l = clone[j].indexOf(word[k], l + 1);
                        }
                        else {
                            positioned = true
                            l = -1;
                            k = word.length;
                        }
                    }
                }
                if (positioned){
                    break;
                }
            }
            if (!positioned){
                var max_half = Math.floor(self.local_matrix.length / 2);
                half_word = Math.floor(clone[j].length / 2);
                for(var m = 0; !positioned  && m < max_half; m++) {
                    for (var n = 0; !positioned && n < max_half; n++) {
                        var place = {'i': m, 'j': n, 'x': 0, 'y': 1};
                        positioned = self.try_put_word(clone[j], 0, half_word, place);
                        if (!positioned){
                            place = {'i': max_half - m, 'j': max_half - n, 'x': 0, 'y': 1};
                            positioned = self.try_put_word(clone[j], 0, half_word, place);
                        }
                    }
                }
            }
        }
        self.fill_empties();
    }

    self.calculatepuzzle = function() {
        // Creates a matrix that should have enough room for all the words contained in self.words
        var max_length = self.words[0].length;
        var cant = max_length;
        for (var i = 1; i < self.words.length; i++) {
            if (max_length < self.words[i].length){
                max_length = self.words[i].length;
            }
            cant += self.words[i].length;
        }
        cant = Math.max(Math.ceil(Math.sqrt(cant)), max_length) + 3;
        self.cleanmatrix(cant);
        self.put_words();
    };

    self.wordattempt = function(x_ini, y_ini, x_end, y_end){
        // Receives an initial position and a final one to determine if there is
        // a selected word that has to be found in the board
        var found = false;
        var x_diff = Math.abs(x_ini - x_end);
        var y_diff = Math.abs(y_ini - y_end);
        if (x_diff != y_diff && x_diff > 1 && y_diff > 1) {
            return found;
        }
        var norm = Math.max(x_diff, y_diff);
        var word = '';
        var dx = (x_end - x_ini) / norm;
        var dy = (y_end - y_ini) / norm;
        for(var i=0; i < norm; i++){
            word += self.local_matrix[x_ini + i * dx][y_ini + i * dy];
        }
        var reversed = word.split("").reverse().join("");
        if (self.words.indexOf(word) != -1 && self.found_words.indexOf(word) === -1) {
            found = true;
            self.positions[word].found = true;
            self.found_words.push(word);
        }
        if (self.words.indexOf(reversed) != -1 && self.found_words.indexOf(reversed) === -1) {
            found = true;
            self.positions[reversed].found = true;
            self.found_words.push(reversed);
        }
        return found;
    }

    self.show_plain_matrix = function(){
        // Shows the board in plain text
        joined = ""
        for (j = 0; j < self.local_matrix.length; j++){
            joined += self.local_matrix[j].join("") + "\n";
        }
        return joined;

    }

    self.show_table_matrix = function(){
        // Shows the board in an html table
        var joined = "";
        for (j = 0; j < self.local_matrix.length; j++){
            joined += "<tr><td>" + self.local_matrix[j].join("</td><td>") + "</td></tr>\n";
        }
        return joined;

    }

    self.won = function(){
        // Returns true if you have found all the words
        var result = true;
        for(word in self.positions){
            result = result && self.positions[word].found;
        }
        return result;
    }
    self.calculatepuzzle();
}
