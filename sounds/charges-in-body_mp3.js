/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABsgfKzWRAAEUpipDNlAAAAC3gAQNIxEgEmmy+cLpqll+4Ma45blu/L7eYfRhiIHQ+vrOF3yjv5Q5B+H1SYjD/iA5Lv8EAKDmFDggIQeQiMEBpW4vWoaZxvX//////68RO9o1ylYh1cvnpGw5FVUPB15JHy7ocCIRmcTdLPvsdHo+5hIfT//q7/8a6kA0WZiJjSRIsCVO//syxAWACDR/d/2BADEnI6y1lRV2C2ErDI6SHqbFnAwNarXq96XxT7sDFlHVqvzGf/Mt1t2DPgnG0CzRR/3bjzSyiKYf9rvxM8w80gpNr/60iAgIio8QxiAhYGCmf22VtHk79goU0MyVpSK40ICnMlavN/auML2jHojr6Noo1B/7b22a7r+Y08qE/1fb/ZyKE3SczqK1MBVWaIiNI//7MsQDgAhdD3HsHKuxE6HttPKdd0kwMZGkqRRk3ZZjGZVL7gdOPFO0dNNmPWicz9lrDpZHx++no3jFf6F38zuhE84l0ygGZG/oX/9xUe4nNwWb///NspsBiKsjJQhxJl4xKyJGPQJppvVnP9Ylv/kqLkfzcgyv5i0qar/89ermKy9x0ox5molgAHov44x3/5hc9QOZnWGrZbLUCkn/+zLEA4AIhR1ZrKhLkPoh7HWBFXaBDS+SxCYhzfYVYLsY2rgdLz0dTNmXrMSy2/Rtk9kedHX3PdEg0+DIR3D8EzXPwoGSrbMBp///9A5VdD1BIF3bbasoEECmh0dea1t9egaWQq7lSgVoKhao69aIjL/qu6S0vksno9urfU9TK+dnOxeRV+kCfR///oETvIySYd2/32jRKYFduhK8//swxAYACOkfa6wEq7EJoi41gR13DCUvlEfgprcduWwkCJ3MyH9SRlPPgSHlpRF1u/rVLHVvo9Tr2PReyOVTnPcSANvMbRhZv/pED0IIGYVwW/3/+cZSYDLV7oulBHMvvy4b8QRL9vmNt2/RQdD/13ByrFGaZmUX1aulvnN1fRLZpzD52pz6Djf1Pkf/5UsOMIY9IK2u1tJKDVGM//syxASACIDZW60Uq5EToiy1pQl2Pjkc46tXzJJPtUTHk1F5g5zgICDofjSIu+yiLoVv149Z7+fT7SZzjvkb36fyDxjqPEyXA7e1X6zFiJdg3/78ZJEkgOikcKBzbFFq9S5ccHATd0gCKQqDo3G4uAvx3Egc//f+yWV165Lv6NR1ZtX1P/nncz4ZASPUThTKT///yxaC27/8YWNtgP/7MsQEAAiZEXWniKuw/aJsNZOVdsTHsICLYpVVZiVqtenMYCd1arV/9f/GAqCwqPw5nlL7EeVi9UxMn8hjihm4mJmYcjjnGiQ9W///+QWC1aEDNdZtSUAABTP6MlmjI51l4qSG4nQTITHpR+rF7tszJt/Skek18Y5NNCmau/vqv80y07PYrEfCb////VEHSMhVgD22vnjTSdEArKL/+zLEBYAH2NlhrCirkPmbKrWlCXJJmpcHe4sfp7fK4EHOMtVh4Qv6MdQ7+7oo5GsWyT7+jyOWQmKY0G/l09ke32EH9CfxdfcpAGSWSUkklQRNWwR4RUQveWQuGHHduirAp5MWvVl/VB6xGS/SlK2W+9L/R5JqCd+/+a1eYit84f6PwGbuKNSqok22wAsRJQDkqmSlFqK5f6TUcguc//swxAqABvTbbawUS7DzGy21g4l2uAfr6///+5ijh5XJN9PvXRG+nq+roenWr+sRyG/yigy9EOsO3/78OQkqC5BbYQ5L6Td9stzkP7B0+Ve3b0//7hUCM4a0HsWHbRhXnI2unS+jUt0IfVGwN1Wj1uSHF711YT2221KIAIHZwlGkk39FFoAe+VzkyCj3n1uivSlnr/tjcjae6+rU//syxBOBB2EPY6woq7jrIu01gql2RUGH06f1y/UvtVyVbTl//1Cx6sehS6tIksCWt+rKLwatfg6LyyplgC///yf/KqnJPpTZEO+16Tn/X+kw79zrmHPYnq2j1//0KhmNiyjAmYE79dximSEAzpTEhCCUs2lsnjMD3Z59FpTasG/8E8J/vdkqzMVob9QQ3VFHzfs/Vin+HXRucR/3///7MsQcgAelF2esCEuw8SIqdaEJcP0pYEPAl9duOkSFANzBY7nE8NzuXHoo7d6gfpv3/+v9R1cWaHvTKWX2bkZR9tWoRG0/yOpbax3/olG/+gcotSFqYV32/+SZJAFaASqcQLf7GiZXIORqYDbH00rNT67TV/V1cSWl/FkOMfmeq1Ufn10W2mX5hUR7ssC+hf6zLCk122sTRJAxbgT/+zLEI4AHjNlprByrsPGbbXWBCXaJBJnXwh+Kw/H5FNjyBx2TWiLbr0/lNct064zmH/jYwUF2xX//g3KP2KYV8+z8JHBeboJ//wAJrHIAyXhpD0ktBOKjl7vETP////4yOKScmTNIX+5joo2+b25N7cEc53edxiVMX+X/9UKVAZILUXf6SRtgK05lyIAThnRTOLgbmaA1RX///b+j//swxCsBB2UXf6YIS7Domy908RV2I45K2v7p9VKWKqC5cTb+7MzPXKhldXQwq7pV+oNrcqphO62gdtpJ4TTCWym7a6JW9kGt2hMiwDfOTev/i7f+jDCAP9luiEf0ejOa31P/pWV1cauu1jf///0j43qoU222FTYBAC0JgKeGIecQ0z8VbHEU4Eumnev7t/7jdgotP1Rh1+h/0/MT//syxDOAB4kVY6woq5DqHa008R12p+l3SYPM6psaKf8ws39QQqLv///pIkkBFTxshuiMtI/kGjJPBDGajWvZerbtT+pJiBFYkzG4opidCi37/TVU9OSjCw5CbCyOHvq///6x2L3//wzlaTgVxcRpl5QWlQcrnfdRPtet//r/V1il0VtAM7K1XV6IQhBf06m9He9YUUhd8oPXiv5ICv/7MsQ8AAfNEXOnnKuw9JsutPEJdh1iHrpCO2221pJJgb6WKnYhEl1ou+GGFLkIc20m6J1bXT8qssItWs9iIddK9EOcf4cnVup3s90Na9sF/83/8EYdTkwK7/f/RwkIBXE9E7ElbKl0P9kcFEyBzGVotS67bPNo/6eJjIraqMB0IToUdtqP+Vurabc1v+v/aX/+JFobIFNHh4h820T/+zLEQgAH1RFhrAhLkPWhrfTzlXaAOvoWDiTk05NLZ2H5tAe8QBoyKFEd4e46VL/Vkuhrf0VRUlH02U870I6YnDX3fd209+ddvnjn3/y0kgXN7/80iQgIdZEMDnoAxWmlsShKgzkXA1FQmF+YiguIm3lHyn/oWxKU/Ojr1ToVwr/ITKraF/h1X6w////8MLGYOvqBy+//6NklASpR//swxEgACFTbbewc67ENoqz1k4l3uATEdwI7DDxyyWztIPhhx5e53b5Nf5jzCystq2EJfs9D1X9BXZfRPxx1c/UVEPq///qoULj1oUw5bbvu2kXMIaXyk+Oej1LGW1hV3PJPe+OIV9WSCaDf7UU4QGy9nn/u+SZRvyf7r+ZiH91A29X9v/1NDcLWf2phPbbbVplJANKFARVEVzZl//syxEiACC0Ra6wIq7D7oiw1gQlzLWhOlMSl75YJnYJjVc6vqy0u312Sty8MSQKUP1U3ljfVv9Trd8PI/4A+3/m5GAObRxJQCAVNCR0+0Gh2H7jL0rNLXPCfHwEFUbcsdfMVNpj+rXzZuHSiDhBXYuqGQT//80nL/z//N/+ogCKxbtVB27YYVyJJAVZIgWJYVzLnZgJ8Xemaz2AhX//7MsRMAQew21+siEuQ/qIsdZOJczf/Vf9mUSnPbZCGb20sjZdDas+Ser9DG/OAf/X/+GfkpBNft/63EQQF4u4fIJkThThhCxMkQNFX9o6s5k0btb/ZEUzHuwI7GOcL6MlFcFnlOstECM5wT+j9YeXUY0v9vGaRJIFNESwMDAS8aw7j448vykH/2vzUwf8636l1HzTWTq0b+mZXRB7/+zDEUQAHVQ1vrAhLuO0SrTTyiS6N/TojBydiurWzmCMn3/k2k1mBpDu8Q+TSRQEJcjTJGdHaIhpLF18Js9Wj2cX9KSuv9XsCvTdfb/tOg/fm6ed0Ok/bbVBer/7f/yOPK02BzWbUVJEBATzeEsxayZ8OQPNV69ShBN1ZR3T/K//V0mVzdNsvkczJIo/5Ojfb9eVOIe+r+n/2jmD/+zLEWYAHtNtlrDRLsPAiLbzzlXabpBjoE9rdtnGi4BGWBEnURH5vwihs3LsoAq2utXVvtTM+sq6EGVyyl4tV+vWdX/L/p+xwfu7R39fn/98GYZ0owe/+/+biIQBBg4Qd57nU9SKgV1Y7cB5a6bj19nVNP6srESru/AogcW9mnKhBvNib/7X6xU/9i//J//Gh8R6cshXtrqMmkWwL//syxGCAB5EdZawUS7jxoix1g4lyr4Et5rgHO2XwaHcct25ZbCZ3q8j2/yzqf/saB4Qd32MlftZCy9tX/6P9HKy7HIKfXp/Ul5pdocv/3+SRAUDBULiAkNAIlYPby3FLkrqCF499zk6aoRQn9NiWR1tspf237b7H9+b6bL/L/9v/1DhBuLjOaQW///3JQAeD7JtiA1MrhVKnrZu3Of/7MsRoAAf1E22nlKu4+BssNZOJckWJ/w8plnFyz9/kuVjX8zOnoutmbbBJ19eeZqL/N/83/7B0ENtWYr+//HZIKgESYSOszW1E+meuNy5+eAjpt6f12/oyufLet1Rv3kS9t8zVq+7I6pXGP/AV/yQv/dnlHARWWgd/zkSSgPQvBZgD8pqk0UgmgSMk7cIIRgmfu//v/uIlEFc7lin/+zDEbQAHmQ9prIhLuOyianWwiXBzOqdr32Rsmp+r7PT3j0f6gE/nWfrem2kAO7YbUpAggdgoVXPVZx7DtzCsQQ66lUVThsA8FtvFX6Pr/9tUk6I62T31L1z4M1CsPmy8yuxn+oX7yX5I8KTDEs3//2laSAjLhJ+j0E8YPjE9S00vvBpUAIDZcSct6Pq//MVXEkfRlHCwCEF19mj/+zLEdIEHmRFVrQhLgPUbbjTxFXagwbR8QxUf0fs35TiVfIZ/9//9RqWkYTms21SQAAEkT3Q4irXAn3UnocpKOlBvshOrlFtTqXmt/JYkk1pUqiF9mp0fXBP0fR1/Si/YLI9n8k4iw1rrttE0XAEUKekQWBPHbm3pxkjwQCXVpI0x26XQzzeqPPc+t6YY4kJ6NUsjvpgm6f6dAaMr//syxHuAB/TbY6yoS7EVoe41gpV3eG/+v/8WzhmB7///6uItAMRPV2Ahl6ejCWEcf7t6NPbXvv29f9dF+dqx/0+qv9x1KftXq4iytuOC259rPxGG0C9tttUiAABTsMFWz7Qb+kktRQ6BHapwtRUAgtou6tT7oMeT+tHB/l0/9aopvgy0dO+aTkKX84J++n9blkA9tttSkU2A/rKhy//7MsR9AAd822GsHEuw+CHsNPKJc8e4bXKhgullUTpwhWIurOrnJLuyJ/9kQW15tdPd+ir+vomXz8PJoSzECbffJb/+jPGog3trdck0UwLjdyDY6lShma6IAbhDkbigQvvRrdT+6qmr/2SITpO0Ev4Pqeo31P7fyco2XQGfaf/Bg2E6oc2221aQIAEGKNlQJFJb9K6s/AtSgpgur3v/+zDEhAAG6Nlzp4irsPKbLHWSiXbK6/fLT/ujA0s5bao5fXWlW+j9W9CovojIa5of1vd+aclhva3baNpKUNx3jJKYXBXsy5fMivqGulTKucvumyN/KOrASQU9Eo6G87V9vo3VtM32R21qwj/5i//uVEBJjEAleYaYjklAwCmfIRl554+oXJoIT0n68YjoBitTH9DVfR1VanfTPxX/+zLEjYAHvRdfrJSrkO6Y67WGiXLRk+s/VGmQwpBfo3X/1mVW7FOH////4wVF2Egx2AroNtUkknhLYsQRFcQLlKZe9lJTRIMb4tdzlfVyKNdS/4sqGWdm8l29mqCnBN+/Xkd/ZQ7L6yE////yDi5nXaFL///m2kUAbApJ6gAtHVUTK2IeKW5CpBAQAjWjTp96s8Z/iqrK5Z/Pgn7v//syxJSAB2DbZawUS7D4Iux084lyqRAT/k69y/SU4NX+L/1f//qQRB0Pb6SxJgOhdDDAljzZD/MAzk47V0jAYR9SH++mv0ofLq7aOKV9TD6NFhga/S/T0V6uejM+tIo/z///UhRxXelAy2221EopAS1awWQnIAowwMwVKtSx2IPmgnRzVdX6N1pR/+jq49ktfdZfV9CUH21N091yc//7MsScAAiJGVPtnKuA/aIr9YKJcpSD7NYDTbs/IPTBNvvv82yCQMJXKR779ccZrtr7vA9Gq9t1OefdaOn+jyjkZG1xRKP1emyvt/+39ZnO6FIUEoozv5WlYL32/9SQAAFRlbdANRqFtmkqa47j9yEGve9+6e5kep+m9Rdl6KY8yc1rlor/7sneTNdkICubdha3dX+piW///ZtIlgP/+zDEngEH9RVvp5RLsPyiLrTylXe0qq8QDmwyUxl+ZEmOtqC4+IwmBYedKj9vtnNf/Srra021l+0qKUa+2MTp9Ur1RDW5RT/41v/wgKgswY+Y9SAnZXdiUSnRHVsCNDObUml0jjw409rzbQKLB04Xmeppf0QMrSv+yOW/VTj0JJ9rUmt+0xZb5so+hjs5ukk/of//+BhjuV64C9v/+zLEogAH5NtbrRxLkOabbXWDlXZt/imSCAzlFIcGpq2a+9lqHJRdoABTsi1YQHelD1EP9jGF3JRKxCN9H71b6qiO43IQyNqDc7fGAfo///7qPBphu2SW1FEJ0RV80yRdW8kqZ32Qa3LwT66VQ9+tkXX+hiMxq2iCR9l9Baqcdrhb0df/yGE6se0DJ5n//+ghljh7lKXf/v/moykA//syxKmAB3jZY6wcS7EXIy21hRV36OtEE8Imc5mc6GCG2hI7V2rRvd0K8n+yUTvOKqpRAY/F3szxgr6ACG/3z/cTpmiBAiuZ/1AlItXVQltttERRAAEqbiso80TTGUpToaTTYz1UObV71t/Rnv9KHrP9ptS7Ef89jBuNNXnBAejOv2MVtSpP9yI2f///6IjRxKWA5ZbLUkimBL1iDP/7MMSsgAjRF1etnOuRBKKstYKJdoM9Y5od5WN9JfTyynE7s6p3S1aIj/9XyKwYxYJ5Vr9vI71NgQB1/X4Q7fwr/+T/+xiwS0qAOWi2VJIpgNNQvR1JDNmzZw/cOSgDECH+NV0t6ya/1rOH7u+aieo1CTo9Vqcat9r6HsoQe9xr5diGDwlQptttqkgQGE5kRZs9z2XUTQYFh5ic/f/7MsSsAAghDVetHKuZAJtttPKVdsBkwgZn1dV60mMrf7rMsHTxszdFqvffD31fCAmQqTsDb0apf+v//DcP02ArLLbWiSmAuVDoWCz36ktx/440mD70qCsrJpui8HWC39diaJZ2ZM2vo/1f6m/qtj65yuizkQC////BaQacHPr/9pGiVA0Dr0I6eENWMaMYNwHqiU2g88yU1/CDMFD/+zLErwAIeRdhrJzrsPuiq7WhCXJGLRuWv7qZp1f5C9H7Xp5Ff3g2/3//5DNYeLUqgl3/++TZRQGq9wOct+kjshl+eN8NO0+hequ9/Vdv99Emm7vN93rZl7aGbCPuZasxror6kw3/b//Ow4l5QApbbRWSAkA/jgGKhHCTw667zxaJs4ZZLALSlOX8z/6ujdi92Rvrs2pPmJ//lU8U//syxLGAB4SjXawISVEDIqy1k4l2/GRgfl/4SD6qYEv//+jaKQD/P41oXLi3yeGXBSTcGBTx8TA8Itq1IlV80u9W/83XOtp5ndH6tMaVWp1b//RyKGqZFqIN/m//0HCuC9sKS7bCxsgoCSr6SdMLHhqQW/k/lGqMaGAhW9Sk/1/8glnEldpmQrlX+zV7a6v//mohm+g1v9v/8gTFpP/7MMS3AAexFV2siEuQ76MuNPCJdkYdhmu//+ttTYB2CS0BJmUfHI8Xr3ygQgQiyBBDPd3uPd/9ov9v8ZB0DvtW5tfZjCA5VQMaMsVf//VUbVLCH/4getIXDGXUG9tHZdGhAIrILNOHiIVAkKkWqoUKKVxVS4qrxmb//gUBaCj3ln1Sx5T7v5UWW1aCLe3+WfQq5SQKEyjM//Uv/P/7MsS9gAeJE2+sHEu44RsqdaCJcM6GUraGv4YCUeGznEv8dGo1b5x41MJIceayHP//zwWi1zh0ihUiPCUed///+aNRso1Is4AAE0oZcyZQwJyfb6ZqbIZ1L3uxhEJCYmY7f/qv2OVUf6//Z2OGojBCIRoNyDzSg6VBMz/4rUxBTUUzLjk5LjVVVVUYLQ/mRfoq+xihkOz//oo0h23/+zLExwAIdQ1trKhLuPUjLTWBFXaMIr/////zFVFRUcpmMUxTCIkEQiEBcVFimERgx3frFkxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxMqACBzZe6YYq7DlDCiBpIzgVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MMTRAEeVGSIDCOuA2BtdLDKdcFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsTUg8ZA7pRAiKuAAAAAAAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEu4PAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;