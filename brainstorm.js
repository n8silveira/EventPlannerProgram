const schedule = [
    0, 15, 30, 45,              // 12:00am, 12:15am, 12:30am, 12:45am
    100, 115, 130, 145,         // 1:00am, 1:15am, 1:30am, 1:45am
    200, 215, 230, 245,         // 2:00am, 2:15am, 2:30am, 2:45am
    300, 315, 330, 345,         // 3:00am, 3:15am, 3:30am, 3:45am
    400, 415, 430, 445,         // 4:00am, 4:15am, 4:30am, 4:45am
    500, 515, 530, 545,         // 5:00am, 5:15am, 5:30am, 5:45am
    600, 615, 630, 645,         // 6:00am, 6:15am, 6:30am, 6:45am
    700, 715, 730, 745,         // 7:00am, 7:15am, 7:30am, 7:45am
    800, 815, 830, 845,         // 8:00am, 8:15am, 8:30am, 8:45am
    900, 915, 930, 945,         // 9:00am, 9:15am, 9:30am, 9:45am
    1000, 1015, 1030, 1045,     // 10:00am, 10:15am, 10:30am, 10:45am
    1100, 1115, 1130, 1145,     // 11:00am, 11:15am, 11:30am, 11:45am
    1200, 1215, 1230, 1245,     // 12:00pm, 12:15pm, 12:30pm, 12:45pm
    1300, 1315, 1330, 1345,     // 1:00pm, 1:15pm, 1:30pm, 1:45pm
    1400, 1415, 1430, 1445,     // 2:00pm, 2:15pm, 2:30pm, 2:45pm
    1500, 1515, 1530, 1545,     // 3:00pm, 3:15pm, 3:30pm, 3:45pm
    1600, 1615, 1630, 1645,     // 4:00pm, 4:15pm, 4:30pm, 4:45pm
    1700, 1715, 1730, 1745,     // 5:00pm, 5:15pm, 5:30pm, 5:45pm
    1800, 1815, 1830, 1845,     // 6:00pm, 6:15pm, 6:30pm, 6:45pm
    1900, 1915, 1930, 1945,     // 7:00pm, 7:15pm, 7:30pm, 7:45pm
    2000, 2015, 2030, 2045,     // 8:00pm, 8:15pm, 8:30pm, 8:45pm
    2100, 2115, 2130, 2145,     // 9:00pm, 9:15pm, 9:30pm, 9:45pm
    2200, 2215, 2230, 2245,     // 10:00pm, 10:15pm, 10:30pm, 10:45pm
    2300, 2315, 2330, 2345      // 11:00pm, 11:15pm, 11:30pm, 11:45pm
];

// convert string input times ("4:45pm") -> int military times (1645)
function convertToMilit(time) {
    // format input into proper convention: 1) hour, 2) mins, 3) am/pm
    const pattern = /^(\d{1,2}):(\d{2})([ap]m)$/i;
    const parts = time.match(pattern); // turns format into array of strings

    let hour = parseInt(parts[1], 10); // hour -> (int)
    const minutes = parseInt(parts[2], 10); // minutes -> (int)
    const meridiem = parts[3].toLowerCase(); // capture "am" or "pm"

    if (meridiem == "pm" && hour != 12) {
        hour += 12; // military hours
    } else if (meridiem == "am" && hour == 12) {
        hour = 0; // checks if midnight
    }
    let militTime = hour * 100 + minutes; // 12 * 100 = 1200
    return militTime;
};

console.log(convertToMilit("8:45pm"));

/*
What is an algorithm that can sort n people and their schedules into m events?
JOSH'S ALGORITHM:
1. make digraph of compatibility pairs (of length n/m)
2. choose a pair (unused)
    - check pair against existing selected pairs
3. repeat until there are m selected pairs
if
    Alex is free from 1-2pm,
    Barbara is free from 1-3pm and 5-6pm,
    Chris is free from 1-3pm,
    Diego is free from 4-6pm,
    Emily is free from 1-2pm and 3-4pm,
    Fran is free from 2-6pm
then
    A: [["1pm", "2pm"]] -> [[1300, 1400]]
    B: [["1pm", "3pm"], ["5pm", "6pm"]] -> [[1300, 1500], [1700, 1800]]
    C: [["1pm", "3pm"]] -> [[1300, 1500]]
    D: [["4pm", "6pm"]] -> [[1600, 1800]]
    E: [["1pm", "2pm"], ["3pm", "4pm"]] -> [[1300, 1400], [1500, 1600]]
    F: [["2pm", "6pm"]] -> [[1400, 1800]]
n = 6 (# of people)
m = 3 (# of bible talks)
p = n/m = 2 (length of each element in compatibility set list)
compatibility set list: (everyone in set can be in same BT)
    (A, B) -> schedule[52, 53, 54, 55] (1-2pm): AC, BD, EF
    (A, C) -> schedule[52, 53, 54, 55] (1-2pm)
    (A, E) -> schedule[52, 53, 54, 55] (1-2pm)
    (B, C) -> schedule[52, 53, 54, 55, 56, 57, 58, 59]
    (B, D)
    (B, E)
    (B, F)
    (C, E)
    (C, F)
    (D, F) -> schedule[] (4-6pm)
    (E, F)
make a "used people" box and a "time" box
greedy algorithm:
for loop:
List<Schedule> findCompatibleTimes(Person A, Person B, int minutes)
scheduleComparison(B, F, 60) -> desired:[["2pm", "3pm"], ["5pm", "6pm"]] // 60 minutes time interval(s)
Check:
- Has (A, B) been used? No. Put (A, B) in "used people" box
    Check: What time? 1-2pm. Put 1-2pm in "time" box
- Has (A, C) been used? Yes, A is already in there.
- Has (A, E) been used? Yes.
- (B, C)? Yes.
- (B, D)? Yes.
- (B, E)? Yes.
- (B, F)? Yes.
- (C, E)? No. Put (C, E) in "used people" box
    Check: What time? 1-2pm. That's the same time as (A, B)! Fail.
- (C, F)? No. Put (C, F) in "used people" box
    Check: What time? 2-3pm. Put 2-3pm in "time" box
- (D, F)? Yes.
- (E, F)? Yes. Out of options; there are not m(2) events
(A, B) doesn't work! Alex and Barbara cannot be in the same Bible talk...
Loop to next compatibility set:
- Has (A, C) been used? No. Slap (A, C) into the "used people" box
    Check: What time? 
AC,
BD,
EF
string toMiliaryTime(string origTime)
"2pm" -strip-> 
strip last two 
string origTime = "2:00pm"
string timeOfDay = origTime.strip(-2)
string time = origTime
print(time) -> "2:00"
print(timeOfDay) -> "pm"
int number = time.strip(":") -> "2".parseToInt()
if (timeOfDay == "pm"):
    number += 12;
slap it back on -> "14:00"
return schedule.findItem(militTime)
*/

// come up with all the methods that need to be written:
