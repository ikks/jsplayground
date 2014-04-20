function SoupLetter(incoming_words){

    var self = this;
    self.local_matrix = undefined;
    self.words = incoming_words.split(',');
    self.local_matrix = new Array();
    self.positions = new Array();
    self.getsin = [
        function(x, k, length, max){ return x - k >= 0 && x + length - k < max; },
        function(x, k, length, max){ return x - length + k >= 0 && x + k < max;},
    ];

    self.cleanmatrix = function(cant){
        self.local_matrix = new Array();
        for (var i = 0; i < cant; i++) {
            self.local_matrix[i] = new Array();
            for (var j = 0; j< cant; j++){
                self.local_matrix[i][j] = '-';
            }
        }
    }

    self.calculatepuzzle = function() {
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
    };


    self.try_word = function(x_dir, y_dir, p_x, p_y, k, word, max){
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
        for(var i=0; i < word.length; i++){
            self.local_matrix[p_x + (i * dir_x)][p_y + (i * dir_y)] = word[i];
        }
        self.positions[word] = ({'i': p_x, 'j': p_y, 'x': dir_x, 'y': dir_y})
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

    self.put_words = function (){
        var clone = self.words.slice(0);
        clone.sort
        (
            function(a, b) {
                return b.length - a.length;
            }
        );
        var word = clone[0];
        var x = 1;
        var y = Math.min(Math.floor(Math.random() * self.local_matrix.length), self.local_matrix.length -1);
        var cur_idx = 0;
        var others = new Array();
        var found = false;
        var dir_x = Math.floor(Math.random() * 3) - 1;
        var dir_y = Math.floor(Math.random() * 3) - 1;
        self.try_put_word(word, 0, 0, {'i': x, 'j': y, 'x': dir_x, 'y': dir_y});
    }

    self.showmatrix = function(){
        joined = ""
        for (j = 0; j < self.local_matrix.length; j++){
            joined += self.local_matrix[j].join("") + "\n";
        }
        return joined;
    }

    self.calculatepuzzle();
    self.put_words();
    self.showmatrix();
}

a = new SoupLetter('gato,perro,canario,elefante');
