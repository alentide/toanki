module.exports = ({ startsWith, Card, meta, line }) => {
    if (!line.startsWith(startsWith)) {
        return line
    }
    const card = new Card(meta);
    card.level = 6;
    card.step.push(line.split("###### ")[1]);
    cards.push(card);
    inputLocation = cards[cards.length - 1].step;
    meta.level6 = cards[cards.length - 1];
    card.parentIndex = meta.level5.index;
    card.parentCard = meta.level5;
};
