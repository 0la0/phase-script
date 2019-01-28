import { pattern } from 'services/EventCycle/Pattern/PatternHandler';
import repeat from 'services/EventCycle/PatternFunctions/RepeatHandler';
import reverse from 'services/EventCycle/PatternFunctions/ReverseHandler';
import offset from 'services/EventCycle/PatternFunctions/OffsetHandler';
import rotate from 'services/EventCycle/PatternFunctions/RotateHandler';
import speed from 'services/EventCycle/PatternFunctions/SpeedHandler';
import every from 'services/EventCycle/PatternFunctions/EveryHandler';
import degrade from 'services/EventCycle/PatternFunctions/DegradeHandler';

export const patternApi = [ repeat, reverse, offset, rotate, speed, every, degrade, pattern ];
