import { useState } from "react";
import { Progress } from "./components/ui/progress";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import html2canvas from "html2canvas";
import {FacebookShareButton, TwitterShareButton, EmailShareButton, EmailIcon, XIcon, FacebookIcon} from 'react-share';

const checklist = [
  {
    id: 0,
    category: "Restructuring Government & Civil Service",
    items: [
      {
        id: 0,
        text: "Dismantling of federal agencies (e.g., Dept of Education)",
        score: 9
      },
      {
        id: 1,
        text: "Replacement of civil servants with loyalists",
        score: 10
      },
      {
        id: 2,
        text: "Weakening checks on executive power",
        score: 9
      },
      {
        id: 3,
        text: "Imposing ideological loyalty tests on federal employees",
        score: 8 },
    ],
  },
  {
    id: 1,
    category: "Legal & Judicial Overhaul",
    items: [
      {
        id: 1,
        text: "Presidential control over DOJ/FBI",
        score: 10
      },
      {
        id: 2,
        text: "Stacking courts with loyalists",
        score: 8 },
      {
        id: 3,
        text: "Limiting judicial independence",
        score: 7
      },
    ],
  },
  {
    id: 2,
    category: "Social Policy Shifts",
    items: [
      {
        id: 0,
        text: "Legal restrictions on abortion",
        score: 9
      },
      {
        id: 2,
        text: "Removal of LGBTQ+ protections",
        score: 8 },
      {
        id: 3,
        text: "Imposing religious doctrine into public education",
        score: 7
      },
    ],
  },
  {
    id: 3,
    category: "Civil Liberties and Free Speech",
    items: [
      {
        id: 1,
        text: "Censorship of dissenting views",
        score: 9
      },
      {
        id: 2,
        text: "Retaliation against journalists",
        score: 8
      },
      {
        id: 3,
        text: "Suppression of protest rights",
        score: 9
      },
    ],
  },
  {
    id: 4,
    category: "Electoral Integrity",
    items: [
      {
        id: 0,
        text: "Politicisation of election administration",
        score: 10
      },
      {
        id: 1,
        text: "Voter suppression laws",
        score: 9
      },
      {
        id: 2,
        text: "Refusal to accept legitimate election results",
        score: 10
      },
    ],
  },
];

function getBarColor(percent) {
  // Map percent (0–100) into gradient: orange → red → black
  // Weighting calculation.

  const lowerPercent = 25;
  const middlePercent = 50;
  const highPercent = 80;

  let r = 255, g = 140, b = 0; // start with orange
  if (percent > lowerPercent && percent <= middlePercent) {
    g = Math.max(0, 140 - (percent - lowerPercent) * 4.67); // reduce green
    b = 0;
  } else if (percent > middlePercent && percent <= highPercent) {
    r = Math.max(0, 255 - (percent - 80) * 5);
    g = 0;
    b = Math.max(0, (percent - 80) * 5);
  } else if (percent > highPercent) {
    r = 0;
    g = 0;
    b = 0;
  }
  return { backgroundColor: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})` };
}

export default function DemocracyRiskTool() {

  const initialiseCheckedArray = () => {

    let params = new URLSearchParams(document.location.search);
    let selected = params.get('selected');

    if (!selected) {
      return {};
    }

    const newChecked = {};

    selected.split(',').forEach((value) => {
      newChecked[value] = true;
    });

    return newChecked;

  };

  const checkedFromUrl = initialiseCheckedArray();

  const [checked, setChecked] = useState(checkedFromUrl);

  const toggle = (category, idx) => {
    const key = `${category}-${idx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allScores = checklist.flatMap(c => c.items.map(i => i.score));
  const maxScore = allScores.reduce((a, b) => a + b, 0);

  const currentScore = Object.entries(checked)
    .filter(([_, v]) => v)
    .map(([key]) => {
      const [catIdx, idx] = key.split("-");
      const category = checklist[catIdx];
      return category ? category.items[parseInt(idx)].score : 0;
    })
    .reduce((a, b) => a + b, 0);

  const riskPercent = Math.round((currentScore / maxScore) * 100);

  const exportImage = () => {
    const element = document.getElementById("dri-container");
    html2canvas(element).then(canvas => {
      const link = document.createElement("a");
      link.download = "Democracy_Risk_Index.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  let shareUrl = "https://afreeargonaut.github.io/democracy-risk-index";

  const generateShareUrl = () => {
    const url = new URL(window.location.href);

    /*checked.reduce((acc, curr) => {
      console.log(acc, curr);
    });*/

    const checkedKeys = Object.keys(checked);
    const checkedValues = Object.values(checked);

    const filteredKeys = checkedKeys.filter((value, index) => {
      return checkedValues[index];
    });

    if (filteredKeys.length === 0) {
      return url.toString();
    }

    const selectedValues = filteredKeys.reduce((acc, val, index) => {
      if (index === 0) {
        return val;
      }

      return acc + "," + val;
    }, "");

    url.searchParams.set("selected", selectedValues/*currentScore*/);
    return url.toString();
  }

  const shareScore = () => {

    const url = generateShareUrl();
    navigator.clipboard.writeText(url.toString());
    alert("Link to your score copied to clipboard!");
  };

  return (
    <div id="dri-container" className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Democracy Risk Index</h1>
      <p className="text-center text-muted-foreground">
        Check items you believe are happening. Your score reflects current risk to democracy.
      </p>

      <Card>
        <CardContent className="space-y-6 py-6">
          {checklist.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h2 className="text-xl font-semibold mb-2">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const key = `${sectionIdx}-${itemIdx}`;
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={checked[key] || false}
                        onChange={() => toggle(section.id, itemIdx)}
                      />
                      <Label htmlFor={key}>{item.text} <span className="text-xs text-gray-500">(Score: {item.score})</span></Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Your Democracy Risk Score: {currentScore} / {maxScore} ({riskPercent}%)</p>
        <div className="w-full h-4 rounded-full bg-gray-200">
          <div
            className="h-4 rounded-full transition-all duration-300"
            style={{ width: `${riskPercent}%`, ...getBarColor(riskPercent) }}
          ></div>
        </div>
      </div>

      <div className="text-center space-x-4">
        <Button onClick={shareScore}>Share My Score</Button>
      </div>
      <div className="text-center space-x-4">
        <FacebookShareButton url={generateShareUrl()}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={generateShareUrl()}>
          <XIcon size={32} round />
        </TwitterShareButton>
        <EmailShareButton url={generateShareUrl()}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </div>
  );
}