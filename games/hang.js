function HangWord(word, maxerrors){
    var self = this;
    this.word = word;
    this.attempts = "";
    this.actualword = this.word.split("");
    this.maxerrors = maxerrors;
    this.currenterrors = 0;
    if (maxerrors === undefined) {
        this.maxerrors = 5;
    }

    for(i=0; i < this.actualword.length; i++){
        this.actualword[i] = "-";
    }


    self.attempt = function(letter){
        var curidx = 0;
        var remainingword = self.word;
        letter = letter.substr(0, 1);
        if (self.attempts.indexOf(letter) !== -1){
            msg = 'Ya habías intentado con ' + letter;
            alert(msg);
            return {error: 1, message: msg};
        }
        found = false;
        for (i=0;i < self.word.length; i++){
            if (self.word[i] === letter){
                found = true;
                self.actualword[i] = letter;
            }
        }
        total = self.attempts.length + self.currenterrors;
        if (found){
            this.attempts += letter;
            total += 1;
            if (self.won()){
                msg = 'Has ganado en ' + total + ' intento';
                if (total > 1){
                    msg += 's';
                }
                return {error: 0, message: msg};
            }
        }
        else {
            self.currenterrors += 1;
            total += 1;
        }
        msg = 'Has hecho ' + total + ' intento';
        if (total > 1){
            msg += 's';
        }
        return {error: 0, message: msg};
    };

    self.currentword = function(){
        return self.actualword.join("");
    };

    self.won = function(){
        return self.word === self.actualword.join('');
    };
}