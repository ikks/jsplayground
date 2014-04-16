function SoupLetter(incoming_words){

    var self = this;
    self.local_matrix = undefined;
    self.words = incoming_words.split(',');
    self.local_matrix = new Array();

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
        self.local_matrix = new Array();
        for (i = 0; i < cant; i++) {
            self.local_matrix[i] = new Array();
            for (j = 0; j< cant; j++){
                self.local_matrix[i][j] = '';
            }
        }
        console.log(self.local_matrix);
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
        console.log(y)
    }
    self.calculatepuzzle();
    self.putwords();
}

a = new SoupLetter('gato,perro,canario,elefante');
