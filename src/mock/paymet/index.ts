export type TCard = {
    card_number: string;
    card_holder: string;
}

export const cards: TCard[] = [
    {
        card_number: "6262 5700 2885 3903",
        card_holder: "Mahkamov Elyorbek",
    },
    {
        card_number: "9860 1201 4837 4115",
        card_holder: "Mahkamov Elyorbek",
    },
    {
        card_number: "6262 5702 1269 0384",
        card_holder: "Mahkamov Mavluda",
    },
    {
        card_number: "6262 5700 1163 5614",
        card_holder: "Mahkamov Mansurjon",
    },
    {
        card_number: "6262 5700 3094 5218",
        card_holder: "Mahkamov Doniyorbek",
    },
    {
        card_number: "5440 8103 0197 8689",
        card_holder: "Anora Mahkamova",
    },
    {
        card_number: "6262 5700 8421 7852",
        card_holder: "Anora Mahkamova",
    },
    {
        card_number: "4073 4200 4193 3445",
        card_holder: "Anora Mahkamova",
    },
    {
        card_number: "4198 1300 9275 7284",
        card_holder: "Anora Mahkamova",
    },
    {
        card_number: "4073 4200 4161 2841",
        card_holder: "Mahkamova Muyassar",
    },
    {
        card_number: "6262 5700 2861 4123",
        card_holder: "Mahkamova Muyassar",
    },
    {
        card_number: "6262 5700 3218 1721",
        card_holder: "Mahkamova Gulsora",
    },
    {
        card_number: "4073 4200 4171 1411",
        card_holder: "Mahkamova Gulsora",
    },
    {
        card_number: "4073 4200 4186 0945",
        card_holder: "Mahkamova Gulnoza",
    },
    {
        card_number: "6262 5700 8730 8617",
        card_holder: "Mahkamova Gulnoza",
    },
    {
        card_number: "4073 4200 4197 9620",
        card_holder: "Ma'murjanova Marjona",
    },
    {
        card_number: "6262 5707 8562 8068",
        card_holder: "Ma'murjanova Marjona",
    },
]


export function getRandomCard(): TCard {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}