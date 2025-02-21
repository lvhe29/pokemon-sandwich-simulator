import SANDWICHES from './data/sandwiches.json';
import FILLINGS from './data/fillings.json';
import CONDIMENTS from './data/condiments.json';
import TYPES from './data/types.json';
import FLAVORS from './data/flavors.json';
import { useEffect, useState } from 'react';
import {
  ALIAS_TO_FULL,
  FLAVOR_TABLE_EZ,
  COLORS,
  checkPresetSandwich,
  copyTextToClipboard,
  craftSandwich,
  getCategory,
  getCondiments,
  getFillings,
  getIngredientsFromRecipe,
  getIngredientsSums,
  getRecipeFromIngredients,
  hasRelevance,
  oneTwoFirst,
  isPower,
  toCN,
  toCN1,
} from './util';
import { runTests } from './test/tests';
import Card from './components/Card';
import './App.css';
import Bubble from './components/Bubble';
import {
  Separator,
  SeparatorH,
  GhostSeparatorV,
  CenteredList,
  StyledClearButton,
  StyledFilterCard,
  MainList,
  ContentList,
  StyledTopBar,
  Button,
  IngredientName,
  AffectList,
  PowerExplain,
} from './style';
import { ArrowRow } from './components/ui';

// per player
const MAX_FILLINGS = 6;
const MAX_CONDIMENTS = 4;
const DISABLE_ALERTS = false;
let NUM_PLAYERS = 1;

function App() {
  const [advancedIngredients, setAdvancedIngredients] = useState(false);
  const [alwaysShowCustomSandwich, setAlwaysShowCustomSandwich] =
    useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [megaSandwichMode, setMegaSandwichMode] = useState(false);
  const [showIngredientName, setShowIngredientName] = useState(false);

  const [activeFillings, setActiveFillings] = useState([]);
  const [activeCondiments, setActiveCondiments] = useState([]);
  const [activeKey, setActiveKey] = useState({});
  const [searchNameQuery, setSearchNameQuery] = useState();
  const [searchEffectQuery, setSearchEffectQuery] = useState();
  const [searchTypeQuery, setSearchTypeQuery] = useState();
  const [searchIngredientQuery, setSearchIngredientQuery] = useState();
  const [results, setResults] = useState([]);
  const [heartbeat, setHeartbeat] = useState(0);
  let activeSandwich = undefined;
  let activeSums;

  useEffect(() => {
    if (!megaSandwichMode) {
      const tempFillings = activeFillings.slice(
        0,
        Math.min(activeFillings.length, MAX_FILLINGS)
      );
      const tempCondiments = activeCondiments.slice(
        0,
        Math.min(activeCondiments.length, MAX_CONDIMENTS)
      );
      setActiveFillings(tempFillings);
      setActiveCondiments(tempCondiments);
      NUM_PLAYERS = 1;
    } else {
      NUM_PLAYERS = 4;
    }
  }, [megaSandwichMode]);

  useEffect(() => {
    // setAlwaysShowCustomSandwich(!simpleMode);
    if (simpleMode) {
      setActiveKey({});
    }
  }, [simpleMode]);

  useEffect(() => {
    const tempResults = [];

    let sandwichList = [];
    if (searchNameQuery) {
      for (const s of SANDWICHES) {
        for (const rawQuery of searchNameQuery) {
          const query = rawQuery.trim();
          if (s.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            sandwichList.push(s);
            continue;
          }
        }
      }
    } else {
      sandwichList = SANDWICHES;
    }

    for (const s of sandwichList) {
      let hasAllQueries = true;
      if (searchEffectQuery) {
        for (const rawQuery of searchEffectQuery) {
          const query = rawQuery.trim();
          if (
            !s.effects.filter(
              (x) => x.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
            )[0]
          ) {
            hasAllQueries = false;
          }
        }
      }

      if (searchTypeQuery) {
        for (const rawQuery of searchTypeQuery) {
          const query = rawQuery.trim();
          if (
            !s.effects.filter(
              (x) => x.type.toLowerCase().indexOf(query.toLowerCase()) !== -1
            )[0]
          ) {
            hasAllQueries = false;
          }
        }
      }

      if (searchIngredientQuery) {
        for (const rawQuery of searchIngredientQuery) {
          const query = rawQuery.trim();
          const ingredients = [...s.fillings, ...s.condiments];
          if (
            !ingredients.filter(
              (x) => x.toLowerCase().indexOf(query.toLowerCase()) !== -1
            )[0]
          ) {
            hasAllQueries = false;
          }
        }
      }

      if (hasAllQueries) {
        tempResults.push(s);
      }
    }

    setResults(tempResults);
  }, [
    searchNameQuery,
    searchEffectQuery,
    searchTypeQuery,
    searchIngredientQuery,
  ]);

  useEffect(() => {
    if (activeSandwich) {
      const activeSandwichElement = document.getElementById(
        `sandwich-${activeSandwich}`
      );
      if (activeSandwichElement) {
        activeSandwichElement.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
    }
  }, [results]);

  const pulse = () => {
    setHeartbeat(heartbeat + 1);
  };

  const clearIngredients = () => {
    setActiveFillings([]);
    setActiveCondiments([]);
  };

  const renderFillings = () => {
    return (
      <div className="filling-bkg">
        {FILLINGS.map((x, i) => renderFilling(x, i))}
      </div>
    );
  };

  const renderFilling = (filling, index, active) => {
    let className = 'ingredient';

    let divClass = 'ingredient-div' + (active ? ' active' : '');
    if (!active && !hasRelevance(filling, activeKey)) {
      divClass = 'ingredient-div ingredient-blur';
    }

    return (
      <div
        className={divClass}
        key={`filling-${index}-${active ? 'active' : 'dormant'}`}
        onClick={() => {
          const tempActiveFillings = activeFillings.slice(0);

          if (active) {
            var indexToRemove = tempActiveFillings.indexOf(filling);
            if (indexToRemove !== -1) {
              tempActiveFillings.splice(indexToRemove, 1);
            }
          } else {
            if (tempActiveFillings.length >= MAX_FILLINGS * NUM_PLAYERS) {
              return;
            }
            tempActiveFillings.push({
              // done this way to avoid modifying base array
              ...filling,
            });
          }

          setActiveFillings(tempActiveFillings);
        }}
      >
        <img
          alt={filling.name}
          title={toCN1(filling.name)}
          src={filling.imageUrl}
          className={className}
        />
        {active && <div className="numbering">{index + 1}</div>}
        {!simpleMode && showIngredientName && (
          <IngredientName>{toCN1(filling.name)}</IngredientName>
        )}
      </div>
    );
  };

  const renderCondiments = () => {
    return (
      <div className="condiment-bkg">
        {CONDIMENTS.map((x, i) => renderCondiment(x, i))}
      </div>
    );
  };

  const renderCondiment = (condiment, index, active) => {
    let className = 'ingredient';

    let divClass = 'ingredient-div' + (active ? ' active' : '');
    if (!active && !hasRelevance(condiment, activeKey)) {
      divClass = 'ingredient-div ingredient-blur';
    }

    return (
      <div
        className={divClass}
        key={`condiment-${index}-${active ? 'active' : 'dormant'}`}
        onClick={() => {
          const tempActiveCondiments = activeCondiments.slice(0);
          if (active) {
            var indexToRemove = tempActiveCondiments.indexOf(condiment);
            if (indexToRemove !== -1) {
              tempActiveCondiments.splice(indexToRemove, 1);
            }
          } else {
            if (tempActiveCondiments.length >= MAX_CONDIMENTS * NUM_PLAYERS) {
              return;
            }
            tempActiveCondiments.push(condiment);
          }
          setActiveCondiments(tempActiveCondiments);
        }}
      >
        <img
          alt={condiment.name}
          title={toCN1(condiment.name)}
          src={condiment.imageUrl}
          className={className}
        />
        {active && (
          <div className="numbering">{index + activeFillings.length + 1}</div>
        )}
        {!simpleMode && showIngredientName && (
          <IngredientName>{toCN1(condiment.name)}</IngredientName>
        )}
      </div>
    );
  };

  const renderActive = () => {
    const showClear = activeFillings.length > 0 || activeCondiments.length > 0;

    return (
      <>
        <CenteredList>
          {showClear && (
            <StyledClearButton onClick={() => clearIngredients()}>
              清空
            </StyledClearButton>
          )}
        </CenteredList>
        <CenteredList>
          {activeFillings.length > 0 ? (
            activeFillings.map((x, i) => renderFilling(x, i, true))
          ) : (
            <div>缺少食材</div>
          )}
          <SeparatorH />
          {activeCondiments.length > 0 ? (
            activeCondiments.map((x, i) => renderCondiment(x, i, true))
          ) : (
            <div>缺少调料</div>
          )}
        </CenteredList>
        {/* {activeFillings.length + activeCondiments.length > 0 && <Separator thin />} */}
      </>
    );
  };

  const renderSandwichBubble = (effect, key) => {
    let power = 'Egg';
    for (const v of Object.keys(ALIAS_TO_FULL)) {
      if (effect.name.indexOf(v) !== -1) {
        power = v;
        break;
      }
    }

    const powerColor = COLORS[power];
    const typeColor = COLORS[effect.type];
    const levelColor = '#e6d0d0';

    return (
      <div className="bubble-row" key={key}>
        <div
          className="bubble chain-a"
          style={{ backgroundColor: powerColor }}
        >{`${toCN(effect.name)}`}</div>
        <div
          className="bubble chain-b"
          style={{
            backgroundColor: typeColor,
            display: effect.type === '' ? 'none' : '',
          }}
        >{`${toCN(effect.type)} `}</div>
        <div
          className="bubble chain-c"
          style={{ backgroundColor: levelColor }}
        >{`Lv. ${effect.level}`}</div>
      </div>
    );
  };

  const renderSandwich = (sandwich) => {
    if (!sandwich) {
      return null;
    }

    let display = `#${sandwich.number} - ${sandwich.name}`;

    if (sandwich.number === '???') {
      display = '⭐'.repeat(sandwich.stars);
      if (sandwich.effects.length === 0) {
        display += '(失败)';
      }
    }

    return (
      <div
        className="card"
        style={{
          position: 'relative',
          padding: '0',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <img
          alt={sandwich.name}
          src={sandwich.imageUrl}
          style={{ height: '120px', width: '120px' }}
        />
        <div
          style={{
            borderLeft: '.5px solid #0005',
          }}
        >
          <div
            onClick={() => {
              if (window.event.ctrlKey) {
                runTests();
              }
            }}
            style={{
              position: 'absolute',
              left: '2px',
              top: '0px',
              // backgroundColor: 'tan',
            }}
          >
            {display}
          </div>
          {sandwich.effects.length > 0 && (
            <AffectList>
              {sandwich.effects.map((x, i) => renderSandwichBubble(x, i))}
            </AffectList>
          )}
          {sandwich.effects.length === 0 && (
            <div className="no-effects">摩托蜥表示无法下咽</div>
          )}
        </div>
      </div>
    );
  };

  const toggleActiveKey = (key) => {
    const tempKey = activeKey;
    const category = getCategory(key);
    if (tempKey[category] === key) {
      tempKey[category] = undefined;
      setActiveKey(tempKey);
    } else {
      tempKey[category] = key;
      setActiveKey(tempKey);
    }
    pulse();
  };

  const renderMath = () => {
    const ingredients = [
      activeFillings.sort((a, b) => a.name.localeCompare(b.name)),
      activeCondiments.sort((a, b) => a.name.localeCompare(b.name)),
    ];

    const sums = getIngredientsSums(activeFillings, activeCondiments);
    activeSums = sums;

    const foundSandwich = checkPresetSandwich(
      sums,
      activeFillings,
      activeCondiments
    );
    const generatedSandwich = craftSandwich(
      activeFillings,
      activeCondiments,
      sums,
      foundSandwich
    );
    activeSandwich = foundSandwich?.number;

    // Sure, we could show results with only condiments, but we can't add only condiments
    // to a sandwich in-game.  We have to add at least one filling, which we would then
    // have to remove to have only condiments left on the sandwich, and since the results vary
    // based on what filling we removed in this case, then there's no point in allowing results
    // with only condiments.
    const showResults =
      activeFillings.length > 0 && activeCondiments.length > 0;

    const renderList = (list, baseNum = 0) =>
      list.map((x, i) => (
        <Card
          ingredient={x}
          number={i + baseNum}
          fillings={activeFillings}
          simpleMode={simpleMode}
          updatePieces={() => pulse()}
          onClickBubble={(key) => toggleActiveKey(key)}
          activeKey={activeKey}
          onClick={() => {
            if (!simpleMode) {
              setAdvancedIngredients(!advancedIngredients);
            }
          }}
          condiments={activeCondiments}
          detail={!simpleMode && advancedIngredients}
        />
      ));

    return (
      <div>
        <CenteredList>
          {renderList(ingredients[0])}
          {/* {!advancedIngredients && <br className="page-break" />} */}
        </CenteredList>
        <CenteredList>
          {renderList(ingredients[1], ingredients[0].length - 1)}
          {/* {!advancedIngredients && <br className="page-break" />} */}
        </CenteredList>
        <ArrowRow />
        {showResults && !simpleMode && advancedIngredients ? (
          <CenteredList>
            <Card
              sums={sums}
              activeSandwich={activeSandwich}
              fillings={activeFillings}
              condiments={activeCondiments}
              detail={!simpleMode && advancedIngredients}
              onClickBubble={(key) => toggleActiveKey(key)}
              activeKey={activeKey}
            />
          </CenteredList>
        ) : null}
        <CenteredList>
          {renderSandwich(foundSandwich) ||
            (showResults &&
              (alwaysShowCustomSandwich || !foundSandwich) &&
              renderSandwich(generatedSandwich)) ||
            '无法制作三明治'}
        </CenteredList>
      </div>
    );
  };

  const renderSearchBubble = (sandwich, key) => {
    const highlight = activeSandwich && sandwich.number === activeSandwich;
    const isWeird = oneTwoFirst.filter((x) => x === sandwich.number)[0];
    const foodCombo = [...sandwich.fillings, ...sandwich.condiments];
    const hasMultiIngredients =
      foodCombo.length !== Array.from(new Set(foodCombo)).length;

    return (
      <div
        className="bubble"
        key={key}
        id={`sandwich-${sandwich.number}`}
        onClick={() => {
          const condiments = getCondiments(sandwich.condiments);
          const fillings = getFillings(sandwich.fillings);
          setActiveCondiments(condiments);
          setActiveFillings(fillings);
        }}
        style={{
          backgroundColor: highlight ? 'yellow' : '#80808030',
          fontWeight: isWeird ? 'bold' : '',
          color: hasMultiIngredients ? '' : '',
        }}
      >
        {`#${sandwich.number} - ${sandwich.name}`}
      </div>
    );
  };

  const search = (ev, criteria) => {
    const text = ev.target.value;
    const queries = text.split(',');

    switch (criteria) {
      case 'name':
        setSearchNameQuery(queries);
        break;
      case 'effect':
        setSearchEffectQuery(queries);
        break;
      case 'type':
        setSearchTypeQuery(queries);
        break;
      case 'ingredient':
        setSearchIngredientQuery(queries);
        break;
      default:
    }
  };

  const renderSearch = () => {
    if (!showSearchPanel) {
      return null;
    }

    return (
      <div className="search-panel">
        <div className="search-bars-div">
          <input
            type="text"
            id="nameSearch"
            placeholder="Search names"
            className="search-bar"
            onChange={(ev) => search(ev, 'name')}
            style={{ width: '250px' }}
          />
          <input
            type="text"
            id="effectSearch"
            placeholder="Search effects (egg, raid, etc)"
            className="search-bar"
            onChange={(ev) => search(ev, 'effect')}
            style={{ width: '250px' }}
          />
          <input
            type="text"
            id="typeSearch"
            placeholder="Search types (normal, dark, etc)"
            className="search-bar"
            onChange={(ev) => search(ev, 'type')}
            style={{ width: '250px' }}
          />
          <input
            type="text"
            id="ingredientSearch"
            placeholder="Search ingredients (ham, bacon, etc)"
            className="search-bar"
            onChange={(ev) => search(ev, 'ingredient')}
            style={{ width: '250px' }}
          />
        </div>
        <div className="search-results-div">
          <div
            className="bubble-row"
            style={{ overflow: 'auto', flexWrap: 'nowrap' }}
          >
            {results.map((x, i) => renderSearchBubble(x, i))}
          </div>
        </div>
      </div>
    );
  };

  const renderComplexSearch = () => {
    return (
      <CenteredList>
        <StyledFilterCard>
          <CenteredList>
            {FLAVORS.map((flavor) => (
              <Bubble
                label={flavor}
                key={flavor}
                isFlavor
                onClick={() => toggleActiveKey(flavor)}
                selected={
                  activeKey && Object.values(activeKey).indexOf(flavor) !== -1
                }
              />
            ))}
          </CenteredList>
          <Separator thin />
          <CenteredList>
            {Object.keys(ALIAS_TO_FULL).map((power) => (
              <Bubble
                label={power}
                key={power}
                onClick={() => toggleActiveKey(power)}
                selected={
                  activeKey && Object.values(activeKey).indexOf(power) !== -1
                }
              />
            ))}
          </CenteredList>
          <Separator thin />
          <CenteredList>
            {TYPES.map((type) => (
              <Bubble
                label={type}
                key={type}
                isType
                onClick={() => toggleActiveKey(type)}
                selected={
                  activeKey && Object.values(activeKey).indexOf(type) !== -1
                }
              />
            ))}
          </CenteredList>
        </StyledFilterCard>
      </CenteredList>
    );
  };

  const saveRecipe = () => {
    const copyStr = getRecipeFromIngredients({
      fillings: activeFillings,
      condiments: activeCondiments,
    });
    if (!copyStr) {
      return;
    }

    console.log('Saving recipe', copyStr);
    copyTextToClipboard(copyStr);

    if (!DISABLE_ALERTS) {
      alert('Copied recipe to clipboard!\n' + copyStr);
    }
  };

  const loadRecipe = () => {
    const recipe = window.prompt('Enter/paste recipe:', '');
    const ingredients = getIngredientsFromRecipe(recipe);
    if (ingredients) {
      const fillings = ingredients.fillings;
      const condiments = ingredients.condiments;

      if (
        fillings.length > MAX_FILLINGS ||
        condiments.length > MAX_CONDIMENTS
      ) {
        setMegaSandwichMode(true);
      }

      setActiveFillings(fillings);
      setActiveCondiments(condiments);
    }
  };

  const renderSettings = () => {
    return (
      <div className="settings-bar">
        <button
          className="button-spacing"
          onClick={() => setShowSearchPanel(!showSearchPanel)}
        >
          搜索栏: {showSearchPanel ? '显示' : '隐藏'}
        </button>
        <button className="button-spacing" onClick={() => loadRecipe()}>
          输入食谱
        </button>
        <button className="button-spacing" onClick={() => saveRecipe()}>
          复制食谱到剪贴板
        </button>
      </div>
    );
  };

  const flavorComboStr = FLAVOR_TABLE_EZ[activeKey.power];
  const powerExplain =
    isPower(activeKey.power) && flavorComboStr ? (
      <span>
        <b>+100 {toCN(activeKey.power)}:</b> {toCN(flavorComboStr)}
      </span>
    ) : null;

  const renderTopBar = () => (
    <StyledTopBar>
      <CenteredList>
        <Button onClick={() => setMegaSandwichMode(!megaSandwichMode)}>
          多人模式: {megaSandwichMode ? '开启' : '关闭'}
        </Button>
        <Button onClick={() => setSimpleMode(!simpleMode)}>
          简单模式: {simpleMode ? '开启' : '关闭'}
        </Button>
        {!simpleMode && (
          <>
            <Button
              onClick={() => setAdvancedIngredients(!advancedIngredients)}
            >
              数值详情: {advancedIngredients ? '显示' : '隐藏'}
            </Button>
            <Button onClick={() => setShowIngredientName(!showIngredientName)}>
              食材名称: {showIngredientName ? '显示' : '隐藏'}
            </Button>
          </>
        )}
      </CenteredList>
      {powerExplain && (
        <>
          <Separator thin />
          <PowerExplain>{powerExplain}</PowerExplain>
        </>
      )}
    </StyledTopBar>
  );

  return (
    <MainList>
      {renderTopBar()}
      <ContentList>
        <GhostSeparatorV />
        {!simpleMode && (
          <>
            {renderComplexSearch()}
            <GhostSeparatorV />
          </>
        )}
        {renderFillings()}
        <Separator thin />
        {renderCondiments()}
        <ArrowRow />
        {renderActive()}
        {renderMath()}
        {/* {renderSettings()} */}
        {/* {renderSearch()} */}
        <GhostSeparatorV h={40} />
        <small>
          翻译自
          <a href="https://github.com/cecilbowen/pokemon-sandwich-simulator">
            这个项目
          </a>
        </small>
      </ContentList>
    </MainList>
  );
}

export default App;
