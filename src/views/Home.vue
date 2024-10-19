<template>
  <el-container>
    <el-main style="padding: 16px 0;overflow: visible;">
      <el-tabs type="border-card" style="box-shadow: var(--el-box-shadow-light);border-radius: 4px;">
        <el-tab-pane :label="t('home.general')">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AEETx" target="_blank">
                      {{ t('home.showDanmaku') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showDanmaku"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AEETx" target="_blank">
                      {{ t('home.mergeSimilarDanmaku') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.mergeSimilarDanmaku"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AEETx" target="_blank">
                      {{ t('home.maxNumber') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.maxNumber" type="number" min="1" style="width: 80px;"></el-input>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#z7YQT" target="_blank">
                      {{ t('home.showInteractWordEnter') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showInteractWordEnter"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#z7YQT" target="_blank">
                      {{ t('home.showInteractWordFollow') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showInteractWordFollow"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#z7YQT" target="_blank">
                      {{ t('home.showInteractWordShare') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showInteractWordShare"></el-switch>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.showSuperchat') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showSuperchat"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.showNewMember') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showNewMember"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.showGift') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showGift"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.showGiftInfo') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showGiftInfo"></el-switch>
              </el-form-item>
              <br>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.mergeGift') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.mergeGift"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.minGiftPrice') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.minGiftPrice" type="number" min="0"
                  :placeholder="t('home.minGiftPricePlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#b9gux" target="_blank">
                      {{ t('home.minTickerPrice') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.minTickerPrice" type="number" min="0.1"
                  :placeholder="t('home.minGiftPricePlaceholder')"></el-input>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#BL6aV" target="_blank">
                      {{ t('home.danmakuAtBottom') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.danmakuAtBottom"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#BL6aV" target="_blank">
                      {{ t('home.tickerAtButtom') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.tickerAtButtom"></el-switch>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="t('home.special')">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#adabf3ed" target="_blank">
                      {{ t('home.allowTextColorSetting') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.allowTextColorSetting"></el-switch>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#28ad9edf" target="_blank">
                      {{ t('home.blockTranslateDanmaku') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.blockTranslateDanmaku"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#28ad9edf" target="_blank">
                      {{ t('home.showTranslateDanmakuOnly') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.showTranslateDanmakuOnly"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#28ad9edf" target="_blank">
                      {{ t('home.translationSign') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.trim="form.translationSign" maxLength='1'
                  :placeholder="t('home.onlyOneCharacter')"></el-input>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomXOffset') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.randomXOffset"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomXRangeMin') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.randomXRangeMin" type="number"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomXRangeMax') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.randomXRangeMax" type="number"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <br>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomYOffset') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.randomYOffset"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomYRangeMin') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.randomYRangeMin" type="number"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomYRangeMax') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.randomYRangeMax" type="number"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <br>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.floatTime') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.floatTime" type="number" min="0"
                  :placeholder="t('home.timePlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.floatDistanceThreshold') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.floatDistanceThreshold" type="number" min="0"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <br>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomXInitialOffset') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.randomXInitialOffset" type="number"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.randomYInitialOffset') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.randomYInitialOffset" type="number"
                  :placeholder="t('home.pixelPlaceholder')"></el-input>
              </el-form-item>
              <br>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.floatDistanceXMin') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.floatDistanceXMin" type="number"
                  :placeholder="t('home.floatDistanceXPlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.floatDistanceXMax') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.floatDistanceXMax" type="number"
                  :placeholder="t('home.floatDistanceXPlaceholder')"></el-input>
              </el-form-item>
              <br>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.floatDistanceYMin') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.floatDistanceYMin" type="number"
                  :placeholder="t('home.floatDistanceYPlaceholder')"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#dba70408" target="_blank">
                      {{ t('home.floatDistanceYMax') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.floatDistanceYMax" type="number"
                  :placeholder="t('home.floatDistanceYPlaceholder')"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="t('home.block')">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <el-form-item>
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.giftDanmaku') }}
                  </a>
                </span>
              </template>
              <el-switch v-model="form.blockGiftDanmaku"></el-switch>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.informalUser') }}
                  </a>
                </span>
              </template>
              <el-switch v-model="form.blockNewbie"></el-switch>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.unverifiedUser') }}
                  </a>
                </span>
              </template>
              <el-switch v-model="form.blockNotMobileVerified"></el-switch>
            </el-form-item>
            <br>
            <el-form-item style="width: calc(50% - 48px); min-width: 500px;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.blockLevel') }}
                  </a>
                </span>
              </template>
              <el-slider v-model="form.blockLevel" size="default" show-input :min="0" :max="60"></el-slider>
            </el-form-item>
            <el-form-item style="width: calc(50% - 48px); min-width: 500px;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.blockMedalLevel') }}
                  </a>
                </span>
              </template>
              <el-slider v-model="form.blockMedalLevel" size="default" show-input :min="0" :max="40"></el-slider>
            </el-form-item>
            <br>
            <el-form-item style="width: 100%;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.blockKeywords') }}
                  </a>
                </span>
              </template>
              <el-input v-model="form.blockKeywords" type="textarea" :rows="5"
                :placeholder="t('home.onePerLine')"></el-input>
            </el-form-item>
            <br>
            <el-form-item style="width: 100%;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.blockUsers') }}
                  </a>
                </span>
              </template>
              <el-input v-model="form.blockUsers" type="textarea" :rows="5"
                :placeholder="t('home.onePerLine')"></el-input>
            </el-form-item>
            <br>
            <el-form-item style="width: 100%;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.blockUsersByKeywords') }}
                  </a>
                </span>
              </template>
              <el-input v-model="form.blockUsersByKeywords" type="textarea" :rows="5"
                :placeholder="t('home.onePerLine')"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="t('home.advanced')">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#zhyBk" target="_blank">
                      {{ t('home.mergeSameUserDanmaku') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.mergeSameUserDanmaku" :disabled="form.autoTranslate"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#zhyBk" target="_blank">
                      {{ t('home.mergeSameUserDanmakuInterval') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.mergeSameUserDanmakuInterval" type="number" min="1"></el-input>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#fwwLM" target="_blank">
                      {{ t('home.fadeOutNum') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.fadeOutNum" type="number" min="1"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#fwwLM" target="_blank">
                      {{ t('home.pinTime') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.pinTime" type="number" min="1"
                  :placeholder="t('home.pinTimePlaceholder')"></el-input>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#PUfUK" target="_blank">
                      {{ t('home.autoTranslate') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.autoTranslate"
                  :disabled="form.mergeSameUserDanmaku"></el-switch>
              </el-form-item>
            </div>
            <el-form-item>
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#PUfUK" target="_blank">
                    {{ t('home.giftUsernamePronunciation') }}
                  </a>
                </span>
              </template>
              <el-radio-group v-model="form.giftUsernamePronunciation">
                <el-radio value="">{{ t('home.dontShow') }}</el-radio>
                <el-radio value="pinyin">{{ t('home.pinyin') }}</el-radio>
                <el-radio value="kana">{{ t('home.kana') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="form-group">
              <el-form-item label="时间格式化">
                <el-input v-model="form.timeFormat" type="text"></el-input>
                <span style="font-size: 14px; opacity: 0.6;">预览：{{ getTimeTextByFormat(new Date(), form.timeFormat) }}</span>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="t('home.emoticon')">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#147119dc" target="_blank">
                      {{ t('home.autoRenderOfficialSmallEmoji') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.autoRenderOfficialSmallEmoji"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#147119dc" target="_blank">
                      {{ t('home.autoRenderOfficialGeneralEmoji') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.autoRenderOfficialGeneralEmoji"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#147119dc" target="_blank">
                      {{ t('home.autoRenderStreamerEmoji') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.autoRenderStreamerEmoji"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#147119dc" target="_blank">
                      {{ t('home.autoRenderPersonalEmoji') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.autoRenderPersonalEmoji"></el-switch>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#185e7d0c" target="_blank">
                      {{ t('home.isSkipSameImage') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.isSkipSameImage"></el-switch>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#8337b9f9" target="_blank">
                      {{ t('home.isGreedyMatch') }}
                    </a>
                  </span>
                </template>
                <el-switch v-model="form.isGreedyMatch"></el-switch>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#16314229" target="_blank">
                      {{ t('home.imageShowType') }}
                    </a>
                  </span>
                </template>
                <el-select v-model="form.imageShowType" style="min-width: 100px;">
                  <el-option v-for="imageShowType in tm<any>('home.imageShowTypes')" :key="imageShowType"
                    :value="rt(imageShowType.id)">
                    {{ rt(imageShowType.name) }}
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#90180b29" target="_blank">
                      {{ t('home.maxImage') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.maxImage" type="number"></el-input>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :title="t('home.openSpecificTutorial')">
                    <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#90180b29" target="_blank">
                      {{ t('home.maxEmoji') }}
                    </a>
                  </span>
                </template>
                <el-input v-model.number="form.maxEmoji" type="number"></el-input>
              </el-form-item>
            </div>
            <el-space wrap style="margin: 16px 0;">
              <el-button type="primary" :icon="Plus" @click="addEmoticon">{{ t('home.addEmoticon') }}</el-button>
              <el-button type="primary" :icon="Plus" @click="addPicture">{{ t('home.addPicture') }}</el-button>
              <el-button type="danger" :icon="Minus" @click="delAllEmoticon">{{ t('home.delAllEmoticon') }}</el-button>
              <el-button type="primary" @click="exportEmoticonConfig">{{ t('home.exportEmoticonConfig') }}</el-button>
              <el-button type="primary"
                @click="openSpecificTutorial('https://www.yuque.com/doodle-irifi/ueaigm/laogg2#67902a4a')"
                style="background: #bed742; border-color: #bed742;">{{ t('home.openTutorial') }}</el-button>
            </el-space>
            <el-table :data="form.emoticons">
              <el-table-column prop="keyword" width="170" :label="t('home.emoticonKeyword')">
                <template #default="scope">
                  <el-input v-model="scope.row.keyword"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="url" :label="t('home.emoticonUrl')">
                <template #default="scope">
                  <el-input v-model="scope.row.url"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="align" width="140" :label="t('home.emoticonAlign')">
                <template #default="scope">
                  <el-select v-model="scope.row.align">
                    <el-option v-for="imageAlignType in tm<any>('home.imageAlignTypes')" :key="imageAlignType"
                      v-bind:value="rt(imageAlignType.id)">{{ rt(imageAlignType.name) }}
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="level" width="140" :label="t('home.imageLevel')">
                <template #default="scope">
                  <el-select v-model.number="scope.row.level" type="number">
                    <el-option v-for="imageLevel in tm<any>('home.imageLevels')" :key="imageLevel"
                      v-bind:value="rt(imageLevel.id)">{{ rt(imageLevel.name) }}
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="height" width="170" :label="t('home.emoticonHeight')">
                <template #default="scope">
                  <el-input v-model.number="scope.row.height" type="number" min="1" max="1000"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="t('home.operation')" width="170">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="danger" :icon="Minus" @click="delEmoticon(scope.$index)"></el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="t('home.testing')">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <el-form-item style="width: calc(50% - 48px); min-width: 500px;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.minDanmakuInterval') }}
                  </a>
                </span>
              </template>
              <el-slider v-model="form.minDanmakuInterval" show-input :min="35" :max="5000"></el-slider>
            </el-form-item>
            <el-form-item style="width: calc(50% - 48px); min-width: 500px;">
              <template #label>
                <span :title="t('home.openSpecificTutorial')">
                  <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2#AtoJ3" target="_blank">
                    {{ t('home.maxDanmakuInterval') }}
                  </a>
                </span>
              </template>
              <el-slider v-model="form.maxDanmakuInterval" show-input :min="35" :max="5000"></el-slider>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="兼容性">
          <el-form :model="form" label-position="right" label-width="auto" inline>
            <div class="form-group">
              <el-form-item style="width: 100%;">
                <template #label>
                  启用粉丝牌等级映射到舰队等级
                </template>
                <div class="dock">
                  <el-switch v-model="form.compatibilityMedalLevelToGuardLevelEnabled"></el-switch>
                  <Slider style="min-width: 200px;" v-model="form.compatibilityMedalLevelToGuardLevel"
                  :max="40" :format="compatibilityMedalLevelToGuardLevelFormat"/>
                </div>
              </el-form-item>
            </div>
            <div class="form-group">
              <el-form-item>
                <template #label>
                  启用大额礼物映射到舰队购买
                </template>
                <el-switch v-model="form.compatibilityGiftToGuardBuyEnabled"></el-switch>
              </el-form-item>
              <el-form-item label="舰长≥ (CNY)">
                <el-input v-model.number="form.compatibilityGiftToGuardBuy[0]" type="number" :min="0"></el-input>
              </el-form-item>
              <el-form-item label="提督≥ (CNY)">
                <el-input v-model.number="form.compatibilityGiftToGuardBuy[1]" type="number" :min="form.compatibilityGiftToGuardBuy[0]"></el-input>
              </el-form-item>
              <el-form-item label="总督≥ (CNY)">
                <el-input v-model.number="form.compatibilityGiftToGuardBuy[2]" type="number" :min="form.compatibilityGiftToGuardBuy[1]"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer style="padding: 0;">
      <el-card>
        <el-form :model="form" label-width="150px">
          <p v-if="obsRoomUrl.length > 1024">
            <el-alert :title="t('home.urlTooLong')" type="warning" show-icon :closable="false"></el-alert>
          </p>
          <el-form-item :label="t('home.roomUrl')">
            <el-input readonly :value="obsRoomUrl" style="width: calc(100% - 8em); margin-right: 1em;"></el-input>
            <el-button type="primary" :icon="CopyDocument" @click="copyUrl"></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openTutorial" style="background: #bed742; border-color: #bed742;">{{
              t('home.openTutorial') }}</el-button>
            <el-button type="primary" @click="enterBilibili">{{ t('home.enterBilibili') }}</el-button>
            <el-button type="primary" :disabled="!roomUrl" @click="enterRoom">{{ t('home.enterRoom') }}</el-button>
            <el-button @click="enterTestRoom">{{ t('home.enterTestRoom') }}</el-button>
            <el-button @click="exportConfig">{{ t('home.exportConfig') }}</el-button>
            <el-button @click="importConfig">{{ t('home.importConfig') }}</el-button>
            <el-button type="danger" @click="resetConfig">{{ t('home.resetConfig') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import {
  CopyDocument,
  Minus,
  Plus,
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import download from 'downloadjs'
import * as chatConfig from '../api/chatConfig'
import { mergeConfig, Config } from '../utils'
import Slider from '@vueform/slider'
import { getTimeTextByFormat } from '../utils'

const { t, tm, rt, locale } = useI18n()
const router = useRouter()

const form = ref<Config>({
  ...chatConfig.getLocalConfig(),
  customCss: window.localStorage.customCss || '',
})

//const roomUrl = ref('www.baidu.com')
// getUnvalidatedRoomUrl -> unvalidatedRoomUrl -> updateRoomUrl -> roomUrl

function copyUrl() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(roomUrl.value)
  }
}

const obsRoomUrl = computed(() => {
  return roomUrl.value
})

const roomUrl = computed(() => {
  return getUnvalidatedRoomUrl(false)
})

function openSpecificTutorial(url: string) {
  window.open(url, '_blank')
}

function addEmoticon() {
  form.value.emoticons?.unshift({
    keyword: '[dog]',
    align: 'inline',
    level: 0,
    height: 16,
    url: 'http://i0.hdslb.com/bfs/live/4428c84e694fbf4e0ef6c06e958d9352c3582740.png'
  })
}

function addPicture() {
  form.value.emoticons?.unshift({
    keyword: '[早稻叽_YES!]',
    align: 'block',
    level: 0,
    height: 64,
    url: 'http://i0.hdslb.com/bfs/emote/1fff7c327eecde37450e3ea95e4cd86490239fd7.png@65w.webp'
  })
}

function delEmoticon(index: number) {
  form.value.emoticons?.splice(index, 1)
}

function delAllEmoticon() {
  ElMessageBox.confirm('确定删除所有表情包吗 ?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'del-all-confirm-button'
  })
    .then(() => {
      form.value.emoticons?.splice(0)
    })
    .catch(() => { })
}

function exportEmoticonConfig() {
  download(JSON.stringify(form.value.emoticons, null, 2), 'emoticons.json', 'application/json')
}

function openTutorial() {
  window.open(`https://www.yuque.com/doodle-irifi/ueaigm/laogg2`, '_blank')
}
function enterBilibili() {
  window.open(`https://live.bilibili.com/`, '_blank')
}
function enterRoom() {
  window.open(roomUrl.value, `room`, 'menubar=0,location=0,scrollbars=0,toolbar=0,width=600,height=600')
}
function enterTestRoom() {
  window.open(getUnvalidatedRoomUrl(true), 'test room', 'menubar=0,location=0,scrollbars=0,toolbar=0,width=600,height=600')
}

function getUnvalidatedRoomUrl(isTestRoom: boolean) {
  let frontFields = {
    roomKeyType: form.value.roomKeyType
  }
  let backFields: any = {
    lang: locale.value,
  }
  let ignoredNames = new Set(['roomId', 'authCode'])
  if (form.value.useLocalEmoticonSetting === true) {
    ignoredNames.add('emoticons')
  } else {
    backFields.emoticons = JSON.stringify(form.value.emoticons)
  }
  if (form.value.compatibilityMedalLevelToGuardLevelEnabled === true) {
    backFields.compatibilityMedalLevelToGuardLevel = JSON.stringify(form.value.compatibilityMedalLevelToGuardLevel);
  } else {
    ignoredNames.add('compatibilityMedalLevelToGuardLevel');
  }
  if (form.value.compatibilityGiftToGuardBuyEnabled === true) {
    backFields.compatibilityGiftToGuardBuy = JSON.stringify(form.value.compatibilityGiftToGuardBuy);
  } else {
    ignoredNames.add('compatibilityGiftToGuardBuy');
  }
  let query: any = { ...frontFields }
  for (let name in form.value) {
    if (!(name in frontFields || name in backFields || ignoredNames.has(name))) {
      query[name] = form.value[name]
    }
  }
  //debugger
  Object.assign(query, backFields)

  // 去掉和默认值相同的字段，缩短URL长度
  query = Object.fromEntries(Object.entries(query).filter(
    ([name, value]) => {
      let defaultValue = chatConfig.DEFAULT_CONFIG[name]
      if (defaultValue === undefined) {
        return true
      }
      if (typeof defaultValue === 'object') {
        defaultValue = JSON.stringify(defaultValue)
      }
      return value !== defaultValue
    }
  ))

  const resolved = router.resolve({ name: isTestRoom ? 'test_room' : 'room', query })
  return `${window.location.origin}${window.location.pathname}${resolved.href}`
}

function exportConfig() {
  let cfg = mergeConfig(form.value, chatConfig.DEFAULT_CONFIG)
  download(JSON.stringify(cfg, null, 2), 'blivechat.json', 'application/json')
}

function importConfig() {
  let input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = () => {
    let reader = new window.FileReader()
    reader.onload = () => {
      let cfg
      try {
        cfg = JSON.parse(reader.result as string)
      } catch (e) {
        ElMessage.error(t('home.failedToParseConfig') + e)
        return
      }
      importConfigFromObj(cfg)
    }
    if (input.files && input.files.length > 0)
      reader.readAsText(input.files[0])
  }
  input.click()
}

function importConfigFromObj(cfg: Config) {
  cfg = mergeConfig(cfg, chatConfig.deepCloneDefaultConfig())
  chatConfig.sanitizeConfig(cfg)
  form.value = {
    ...cfg
  }
}

function resetConfig() {
  ElMessageBox.confirm('确定重置配置吗 ?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'del-all-confirm-button'
  }).then(() => {
    let cfg = {
      ...chatConfig.deepCloneDefaultConfig()
    }
    chatConfig.sanitizeConfig(cfg)
    form.value = cfg
  })
}

const compatibilityMedalLevelToGuardLevelFormat = {
  prefix: '≤',
  decimals: 0
}
</script>

<style>
.el-tab-pane>.el-card {
  border-radius: 8px;
  border: none;
  background-color: none;
}

.el-tab-pane>.el-card:hover {
  background-color: #ebeef5;
}

.el-form-item__label:hover {
  color: #409eff;
}

.el-card__body {
  padding: 20px 20px 4px 20px;
}

a {
  color: #606266;
}

a:hover {
  color: #409eff;
}

.el-message-box__content {
  font-size: 18px;
  font-weight: bold;
}

.del-all-confirm-button:hover {
  background: #f78989;
  border-color: #f78989;
}

.del-all-confirm-button:focus,
.del-all-confirm-button {
  background: #f56c6c;
  border-color: #f56c6c;
}

.form-group {
  border-radius: 8px;
  border: none;
  background-color: none;
  padding: 20px 20px 4px 20px;
  transition: background-color 0.3s ease;
}

.form-group:hover {
  background-color: #ebeef5;
}

.slider-base {
  --slider-connect-bg: var(--el-color-primary);
  --slider-tooltip-bg: var(--el-color-primary);
  --slider-handle-ring-color: #40a0ff3f;
}

.slider-base > .slider-connects > .slider-connect::after {
  content: '';
  display: block;
  height: 100%;
  width: 99999px;
  background: var(--slider-connect-bg,#10b981);
  position: absolute;
  left: 100%;
  transform: none !important;
}

.slider-base > .slider-origin:nth-child(2) > .slider-handle::after {
  content: '舰长';
  display: block;
  position: absolute;
  text-wrap: nowrap;
  right: -46px;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--slider-tooltip-bg,#10b981);
  color: var(--slider-tooltip-color,#fff);
}

.slider-base > .slider-origin:nth-child(2) > .slider-handle::before{
  content: '无';
  display: block;
  position: absolute;
  text-wrap: nowrap;
  top: 16px;
  left: -32px;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--slider-bg,#d1d5db);
  color: var(--slider-tooltip-color,#fff);
}

.slider-base > .slider-origin:nth-child(3) > .slider-handle::after {
  content: '提督';
  display: block;
  position: absolute;
  text-wrap: nowrap;
  right: -46px;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--slider-tooltip-bg,#10b981);
  color: var(--slider-tooltip-color,#fff);
}

.slider-base > .slider-origin:nth-child(4) > .slider-handle::after {
  content: '总督';
  display: block;
  position: absolute;
  text-wrap: nowrap;
  right: -46px;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--slider-tooltip-bg,#10b981);
  color: var(--slider-tooltip-color,#fff);
}
</style>

<style lang="scss" scoped>
.dock {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  > *:not(:first-child) {
    margin-left: 8px;
  }

  > :last-child {
    flex-grow: 1;
  }
}
</style>

<style src="@vueform/slider/themes/default.css"></style>