function SoupLetter(incoming_words){

    var self = this;
    self.local_matrix = undefined;
    self.words = incoming_words.split(',');
    self.local_matrix = new Array();
    self.positions = new Array();

    self.cleanmatrix = function(cant){
        self.local_matrix = new Array();
        for (i = 0; i < cant; i++) {
            self.local_matrix[i] = new Array();
            for (j = 0; j< cant; j++){
                self.local_matrix[i][j] = '-';
            }
        }
    }

    self.calculatepuzzle = function() {
        max_length = self.words[0].length;
        cant = max_length;
        for (i = 1; i < self.words.length; i++) {
            if (max_length < self.words[i].length){
                max_length = self.words[i].length;
            }
            cant += self.words[i].length;
        }
        cant = Math.max(Math.ceil(Math.sqrt(cant)), max_length) + 3;
        self.cleanmatrix(cant);
    };

    self.putwords = function (){
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
        for (i=0; i < clone[0].length; i++){
            self.local_matrix[x + i][y] = clone[0][i];
        }
        self.positions.push({'i': x, 'j': y, 'x': 1, 'y': 0})
    }

    self.showmatrix = function(){
        joined = ""
        for (j = 0; j < self.local_matrix.length; j++){
            joined += self.local_matrix[j].join("") + "\n";
        }
        return joined;
    }

    self.calculatepuzzle();
    self.putwords();
}

a = new SoupLetter('gato,perro,canario,elefante');
